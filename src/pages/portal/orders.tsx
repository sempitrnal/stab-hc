"use client";

import OrdersTable from "@/components/OrdersTable";
import Image from "next/image";
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  console.log(search);
  console.log(orders);
  useEffect(() => {
    const fetchOrders = async (search: string) => {
      try {
        const baseUrl = process.env.STRAPI_URL;
        const query = search
          ? new URLSearchParams({
              "filters[$or][0][firstName][$containsi]": search,
              "filters[$or][1][lastName][$containsi]": search,
              "filters[$or][2][email][$containsi]": search,
            }).toString()
          : "";

        const res = await fetch(`/api/orders?${query}&populate=*`, {});
        const json = await res.json();
        setOrders(json.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders(search);
  }, [search]);
  const itemTally: Record<string, { quantity: number; image: string }> = {};
  orders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      const key = `${item.name}||${item.size}||${item.color}`;
      if (itemTally[key]) {
        itemTally[key].quantity += item.quantity;
      } else {
        itemTally[key] = {
          quantity: item.quantity,
          image: item.image,
        };
      }
    });
  });
  console.log(orders);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrdersTable search={search} setSearch={setSearch} orders={orders} />
      )}

      <div className="p-6 bg-white ">
        <h2 className="mb-10 text-lg font-semibold">Item Tally</h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(itemTally).map(([key, { quantity, image }]) => {
            const [name, size, color] = key.split("||");

            return (
              <li
                key={key}
                className="flex items-start gap-4 bg-white rounded "
              >
                <Image
                  width={100}
                  height={100}
                  src={image}
                  alt={name}
                  className="object-cover rounded"
                />
                <div className="flex flex-col">
                  <p className="font-medium lowercase">{name}</p>
                  <p className="text-sm text-gray-600 lowercase">
                    {size} – {color}
                  </p>
                  <p className="text-sm font-semibold">
                    {quantity} {quantity > 1 ? "pcs" : "pc"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Orders;
