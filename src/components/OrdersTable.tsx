import { AnimatePresence, motion } from "framer-motion";
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
    <div className="w-full p-6">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // router.push(
            //   {
            //     pathname: router.pathname,
            //     query: { ...router.query, search: e.target.value },
            //   },
            //   undefined,
            //   { shallow: true }
            // );
          }}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Contact</th>
              <th className="px-4 py-2 border">Delivery</th>
              <th className="px-4 py-2 border">Payment</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Items</th>
              <th className="px-4 py-2 border">Proof</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">{order.contactNumber}</td>
                  <td className="px-4 py-2">
                    {order.deliveryMethod === "ship" ? (
                      <div>
                        <div>{order.address.street}</div>
                        <div>{order.address.barangay}</div>
                        <div>
                          {order.address.city}, {order.address.province}{" "}
                          {order.address.zip}
                        </div>
                      </div>
                    ) : (
                      "Pick up"
                    )}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {order.paymentMethod}
                  </td>
                  <td className="px-4 py-2">₱{order.total.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    {order.items?.map((item: any, i: any) => (
                      <div key={i}>
                        {item.name} ({item.size}) x{item.quantity} - ₱
                        {item.price.toFixed(2)}
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    <Image
                      width={48}
                      height={48}
                      src={order.proof.url}
                      alt="Proof"
                      className="object-cover w-12 h-12 rounded cursor-pointer hover:opacity-80"
                      onClick={() => setModalImage(order.proof.url)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setModalImage(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative p-4 bg-white rounded shadow-md max-w-[90vw] max-h-[90vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setModalImage(null)}
                className="absolute text-sm text-gray-500 top-2 right-2 hover:text-black"
              >
                Close
              </button>
              <img
                src={modalImage}
                alt="Proof of Payment"
                className="max-w-full max-h-[80vh] rounded"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersTable;
