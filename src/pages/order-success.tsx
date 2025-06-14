"use client";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

const OrderSuccess = () => {
  const router = useRouter();
  const { ref } = router.query;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  console.log(ref);
  useEffect(() => {
    if (!ref) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders?ref=${ref}`);
        const data = await res.json();
        console.log(data);
        setOrder(data.data[0]); // assuming orderId is unique
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [ref]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Head>
          <title className="lowercase">Order Success | stab.cult</title>
        </Head>
        <p className="text-gray-500">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Head>
          <title className="lowercase">Order Success | stab.cult</title>
        </Head>
        <p className="text-red-500">Order not found.</p>
      </div>
    );
  }

  const orderData = order;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 bg-[#fafafa]">
      <Head>
        <title className="lowercase">Order Success | stab.cult</title>
      </Head>
      <div className="w-full max-w-md p-8 text-center bg-white border shadow-md rounded-xl">
        <FiCheckCircle className="mx-auto mb-4 text-5xl text-green-500" />
        <h1 className="mb-2 text-2xl font-bold">Order Placed Successfully</h1>
        <p className="mb-6 text-gray-600">
          {`Thank you for your purchase! We'll reach out to confirm your order
          details and shipping info soon.`}
        </p>

        <div className="flex flex-col gap-2 p-4 mb-6 text-sm text-left border rounded-md bg-gray-50">
          <p>
            <span className="font-medium">Order Reference:</span>{" "}
            <span className="text-gray-800">{orderData.orderId}</span>
          </p>
          <p>
            <span className="font-medium">Payment Method:</span>{" "}
            {orderData.paymentMethod === "gcash" ? "GCash" : "Bank Transfer"}
          </p>
          <p>
            <span className="font-medium">Shipping Address:</span>{" "}
            {orderData.shippingAddress
              ? `${orderData.shippingAddress.name}, ${orderData.shippingAddress.address}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.zipCode}`
              : "N/A"}
          </p>
          {/* Order summary */}
          <p className="font-medium">Order Summary:</p>
          {orderData.items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <Image width={100} height={100} src={item.image} alt="" />
              <div className="flex flex-col">
                <p>{item.name} </p>
                <p className="text-sm text-gray-500">
                  Size: {item.size} | Qty: {item.quantity}
                </p>
                <p className="text-sm">
                  Price: ₱{item.price.toFixed(2)} x {item.quantity} = ₱
                  {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          <p>
            <span className="font-medium">Total:</span> ₱
            {orderData.total.toFixed(2)}
          </p>
        </div>

        <Link
          href="/"
          className="inline-block w-full px-6 py-3 text-sm font-medium text-white transition bg-black rounded hover:bg-gray-800"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
