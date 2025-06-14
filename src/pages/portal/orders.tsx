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
  type Tally = Record<
    string, // item name
    {
      image: string;
      variations: Record<
        string, // color
        Record<string, number> // size => quantity
      >;
    }
  >;

  const itemTally: Tally = {};
  const sizeOrder = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
  ];
  orders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      const { name, size, color, quantity, image } = item;

      if (!itemTally[name]) {
        itemTally[name] = {
          image,
          variations: {},
        };
      }

      if (!itemTally[name].variations[color]) {
        itemTally[name].variations[color] = {};
      }

      itemTally[name].variations[color][size] =
        (itemTally[name].variations[color][size] || 0) + quantity;
    });
  });

  return (
    <div className="flex flex-col gap-4 p-5 md:p-20">
      <h1 className="mb-4 text-3xl font-bold">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrdersTable search={search} setSearch={setSearch} orders={orders} />
      )}

      <div className="p-4 mt-10 bg-white border rounded md:p-6 ">
        <h2 className="mb-10 text-lg font-semibold">Item Tally</h2>
        <ul className="space-y-6">
          {Object.entries(itemTally).map(([name, { image, variations }]) => {
            const totalQty = Object.values(variations).reduce((sum, sizes) => {
              return (
                sum + Object.values(sizes).reduce((acc, qty) => acc + qty, 0)
              );
            }, 0);

            return (
              <li key={name}>
                <div className="flex items-start gap-4 mb-2">
                  <Image
                    width={100}
                    height={100}
                    src={image}
                    alt={name}
                    className="object-cover rounded"
                  />
                  <div>
                    <p className="mb-2 text-xl lowercase">{name}</p>
                    <div className="flex flex-col gap-2">
                      {Object.entries(variations).map(([color, sizes]) => (
                        <div key={color}>
                          <p className="text-sm lowercase">{color}</p>
                          <ul className="ml-4 text-sm text-gray-700 lowercase">
                            {Object.entries(sizes)
                              .sort(([a], [b]) => {
                                const sizeOrder = [
                                  "xs",
                                  "sm",
                                  "md",
                                  "lg",
                                  "xl",
                                  "2xl",
                                ];
                                const aIndex = sizeOrder.indexOf(
                                  a.toLowerCase()
                                );
                                const bIndex = sizeOrder.indexOf(
                                  b.toLowerCase()
                                );
                                return (
                                  (aIndex === -1 ? Infinity : aIndex) -
                                  (bIndex === -1 ? Infinity : bIndex)
                                );
                              })
                              .map(([size, qty]) => (
                                <li key={size}>
                                  {size} – {qty} {qty > 1 ? "pcs" : "pc"}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                      <p className="mt-2 text-sm font-semibold">
                        total: {totalQty} {totalQty > 1 ? "pcs" : "pc"}
                      </p>
                    </div>
                  </div>
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
