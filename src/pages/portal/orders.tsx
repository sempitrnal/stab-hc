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
    <div className="p-6">
      <h1 className="mb-4 text-3xl font-bold">Orders</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <OrdersTable search={search} setSearch={setSearch} orders={orders} />
      )}

      <div className="p-6 bg-white ">
        <h2 className="mb-10 text-lg font-semibold">Item Tally</h2>
        <ul className="flex space-y-6">
          {Object.entries(itemTally).map(([name, { image, variations }]) => (
            <li key={name}>
              <div className="flex items-center gap-4 mb-2">
                <Image
                  width={100}
                  height={100}
                  src={image}
                  alt={name}
                  className="object-cover rounded"
                />
                <div className="">
                  <p className="text-lg font-semibold lowercase">{name}</p>
                  <div className="">
                    {Object.entries(variations).map(([color, sizes]) => (
                      <div key={color}>
                        <p className="font-medium lowercase">{color}</p>
                        <ul className="ml-4 text-sm text-gray-700 lowercase">
                          {Object.entries(sizes).map(([size, qty]) => (
                            <li key={size}>
                              {size} – {qty} {qty > 1 ? "pcs" : "pc"}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Orders;
