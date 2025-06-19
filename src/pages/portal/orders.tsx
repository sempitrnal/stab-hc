"use client";

import OrdersTable from "@/components/OrdersTable";
import { SizeKey } from "@/types/product";
import Image from "next/image";
import { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    color: "",
    size: "",
    item: "",
    deliveryMethod: "",
  });
  const [filterOptions, setFilterOptions] = useState<any>();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [metaPagination, setMetaPagination] = useState({
    page: 1,
    pageCount: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders?populate=*");
        const json = await res.json();
        setAllOrders(json.data);
        if (isInitialLoad) {
          setOrders(json.data);
          setIsInitialLoad(false);
        }
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (err) {
        console.error("Failed to fetch all orders:", err);
      }
    };

    fetchAllOrders();
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);

      try {
        if (
          !search &&
          !filters.item &&
          !filters.color &&
          !filters.size &&
          !filters.deliveryMethod
        ) {
          const res = await fetch(
            `/api/orders?populate=*&pagination[pageSize]=10&pagination[page]=${metaPagination.page}`
          );
          const json = await res.json();
          console.log(json.data[0]);
          setOrders(json.data);
          setMetaPagination(json.meta.pagination);
          setTimeout(() => setLoading(false), 2000);
          return;
        }

        const query = new URLSearchParams();
        if (search) {
          query.append("search", search);
        }
        if (filters.item) query.append("item", filters.item);
        if (filters.color) query.append("color", filters.color);
        if (filters.size) query.append("size", filters.size);
        if (filters.deliveryMethod)
          query.append("deliveryMethod", filters.deliveryMethod);
        query.append("populate", "*");
        query.append("pagination[pageSize]", "10");
        query.append("pagination[page]", String(metaPagination.page));
        const res = await fetch(`/api/orders?${query.toString()}`);
        const json = await res.json();
        console.log(json);
        setOrders(json.data);
        setMetaPagination(json.meta.pagination);
        setTimeout(() => setLoading(false), 2000);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [search, filters, metaPagination.page]);

  type Tally = Record<
    string,
    {
      image: string;
      variations: Record<string, Record<string, number>>;
    }
  >;

  const itemTally: Tally = {};
  const sizeOrder = [
    "xs",
    "small",
    "medium",
    "large",
    "xl",
    "2xl",
    "3xl",
    "4xl",
    "5xl",
    "6xl",
  ];

  allOrders.forEach((order: any) => {
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
  type FilterOptions = {
    productNames: string[];
    colors: { key: string; name: string; hex: string }[];
    sizes: string[]; // e.g., ["xs", "sm", "md"]
  };

  useEffect(() => {
    getFilterOptions();
  }, []);
  const getFilterOptions = async () => {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/products?pagination[pageSize]=100&populate=*`
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    const products = await res.json();

    type Product = {
      name: string;
      images: string[];
      color?: any;
      size_chart?: Record<string, { label: string }>;
    };
    const productSet = new Set<Product>();
    const colorSet = new Set<string>();
    type SizeFilter = { key: string; label: string };
    const sizeMap = new Map<string, string>();

    for (const product of products.data) {
      productSet.add(product);
      if (Array.isArray(product.color)) {
        for (const color of product.color) {
          if (color?.key) {
            colorSet.add(color);
          }
        }
      }
      const sizeChart: Record<string, { label: string }> =
        product.size_chart || {};
      Object.entries(sizeChart).forEach(([sizeKey, sizeValue]) => {
        if (sizeKey && sizeValue?.label) {
          sizeMap.set(sizeKey, sizeValue.label);
        }
      });
    }
    const order: SizeKey[] = [
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

    const sizes: SizeFilter[] = Array.from(sizeMap.entries())
      .map(([_, label]) => ({
        key: label.toLowerCase(), // key will now be 'xs', 'sm', etc.
        label,
      }))
      .sort((a, b) => {
        return (
          order.indexOf(a.key as SizeKey) - order.indexOf(b.key as SizeKey)
        );
      });
    setFilterOptions({
      products: Array.from(productSet).map((e) => ({
        name: e.name,
        images: Array.isArray(e.images)
          ? e.images
              .slice(0, 1)
              .map((img: any) => ({ url: img.url || "/fallback.jpg" }))
          : [{ url: "/fallback.jpg" }],
      })),
      colors: Array.from(colorSet),
      sizes: sizes,
    });
  };
  return (
    <div className="flex flex-col gap-4 p-5 md:p-20">
      <h1 className="mb-4 text-3xl font-bold">Orderz</h1>

      <OrdersTable
        metaPagination={metaPagination}
        onPageChange={(page) => {
          setMetaPagination((prev) => ({ ...prev, page }));
        }}
        orders={orders}
        search={search}
        setSearch={setSearch}
        filters={filters}
        loading={loading}
        setFilters={setFilters}
        filterOptions={filterOptions}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
      />

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <select
          className="p-2 border rounded"
          onChange={(e) => {
            const newStatus = e.target.value;
            if (!newStatus) return;
            selectedOrders.forEach(async (id) => {
              await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: { orderStatus: newStatus } }),
              });
            });
          }}
        >
          <option value="">Update Status</option>
          <option value="preorder">Preorder</option>
          <option value="processing">Processing</option>
          <option value="ready_for_pickup">Ready for Pickup</option>
          <option value="ready_to_ship">Ready to Ship</option>
          <option value="completed">Completed</option>
        </select>
        <p className="text-sm text-gray-600">
          {selectedOrders.length} selected
        </p>
      </div>

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
