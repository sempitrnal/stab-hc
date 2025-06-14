import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

const OrdersTable = ({
  orders,
  search,
  setSearch,
}: {
  orders: any[];
  search: string;
  setSearch: (value: string) => void;
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  console.log(orders);
  const router = useRouter();

  return (
    <div className="space-y-6">
      {orders.length > 0 ? (
        orders.map((order, idx) => (
          <div key={idx} className="p-4 border rounded shadow-sm">
            <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
              <span className="font-medium">Order ID: {order.orderId}</span>
              <span>₱{order.total.toFixed(2)}</span>
            </div>

            <div className="mb-4 text-sm text-gray-700">
              <p className="font-medium">
                {order.firstName} {order.lastName}
              </p>
              <p>{order.email}</p>
              <p>{order.contactNumber}</p>
              <p className="mt-1 italic">
                {order.deliveryMethod === "ship"
                  ? `${order.address.street}, ${order.address.barangay}, ${order.address.city}, ${order.address.province}, ${order.address.zip}`
                  : "Pick up"}
              </p>
              <p className="capitalize">Payment: {order.paymentMethod}</p>
            </div>

            <div className="space-y-4">
              {order.items?.map((item: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <Image
                    width={100}
                    height={100}
                    alt=""
                    src={item.image}
                    className="object-cover rounded"
                  />
                  <div className="text-sm text-gray-800">
                    <p className="font-medium lowercase">{item.name}</p>
                    <p className="text-xs text-gray-500 uppercase">
                      {item.color}
                    </p>
                    <p className="text-xs">x{item.quantity}</p>
                    <p className="text-xs">
                      ₱{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Image
                width={48}
                height={48}
                src={order.proof.url}
                alt="Proof"
                className="object-cover w-12 h-12 rounded cursor-pointer hover:opacity-80"
                onClick={() => setModalImage(order.proof.url)}
              />
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No orders found.</p>
      )}
    </div>
  );
};

export default OrdersTable;
