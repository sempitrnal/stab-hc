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

      <div className="p-4 bg-white border rounded shadow">
        <h2 className="mb-2 text-lg font-semibold">Item Tally</h2>
        <ul>
          {Object.entries(itemTally).map(([key, { quantity, image }]) => {
            const [name, size, color] = key.split("||");

            return (
              <li key={key} className="flex items-center gap-4 mb-2">
                <img
                  src={image}
                  alt={name}
                  className="object-cover w-12 h-12 rounded"
                />
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-600 lowercase">
                    {size} – {color}
                  </p>
                  <p className="text-sm font-semibold">{quantity} pcs</p>
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
