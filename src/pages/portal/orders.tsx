"use client";

import OrdersTable from "@/components/OrdersTable";
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

        const res = await fetch(`${baseUrl}/api/orders?${query}&populate=*`);
        const json = await res.json();
        setOrders(json.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders(search);
  }, [search]);
  const itemTally: Record<string, number> = {};

  orders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      const key = `${item.name}||${item.size}`;
      itemTally[key] = (itemTally[key] || 0) + item.quantity;
    });
  });
  return (
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrdersTable search={search} setSearch={setSearch} orders={orders} />
      )}

      <div className="p-4 bg-white border rounded shadow">
        <h2 className="mb-2 text-lg font-semibold">Item Tally</h2>
        <ul className="text-sm list-disc list-inside">
          {Object.entries(itemTally).map(([key, quantity]) => {
            const [name, size] = key.split("||");
            return (
              <li key={key}>
                {name} - {size}: {quantity}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Orders;
