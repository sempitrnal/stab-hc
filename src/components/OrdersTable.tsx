import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Spinner } from "./ui/Spinner";

const OrdersTable = ({
  orders,
  search,
  setSearch,
  filters,
  filterOptions,
  setFilters,
  loading,
}: {
  orders: any[];
  search: string;
  setSearch: (value: string) => void;
  filters: any;
  setFilters: any;
  filterOptions: any;
  loading: boolean;
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();
  const [showShirtDropdown, setShowShirtDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [key]: value,
    }));

    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col w-full max-w-full gap-2 mb-4 md:flex-row md:items-center md:gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search orders..."
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
        <div className="relative w-full ">
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-2 text-sm text-left lowercase bg-white border border-gray-300 rounded"
            onClick={() => setShowShirtDropdown(!showShirtDropdown)}
          >
            {filters.item || "All Items"}
            <span>▾</span>
          </button>
          {showShirtDropdown && (
            <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
              <div
                onClick={() => {
                  handleFilterChange("item", "");
                  setShowShirtDropdown(false);
                }}
                className="px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
              >
                All Items
              </div>
              {filterOptions.products.map((product: any) => {
                return (
                  <div
                    key={product.name}
                    onClick={() => {
                      handleFilterChange("item", product.name);
                      setShowShirtDropdown(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm lowercase cursor-pointer hover:bg-gray-100"
                  >
                    <img
                      src={product.images?.[0]?.url || "/fallback.jpg"}
                      alt=""
                      className="object-cover w-6 h-6 rounded"
                    />
                    {product.name}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative w-full ">
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded"
            onClick={() => setShowColorDropdown(!showColorDropdown)}
          >
            {filters.color || "All Colors"}
            <span>▾</span>
          </button>
          {showColorDropdown && (
            <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
              <div
                onClick={() => {
                  handleFilterChange("color", "");
                  setShowColorDropdown(false);
                }}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                All Colors
              </div>
              {filterOptions.colors.map((color: any) => (
                <div
                  key={color.key}
                  onClick={() => {
                    handleFilterChange("color", color.name);
                    setShowColorDropdown(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  <span
                    className="w-4 h-4 border rounded-full"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full ">
          <button
            type="button"
            className="flex items-center justify-between w-full px-4 py-2 text-sm text-left bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
            onClick={() => setShowSizeDropdown(!showSizeDropdown)}
          >
            {filters.size || "All Sizes"}
            <span>▾</span>
          </button>
          {showSizeDropdown && (
            <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-64">
              <div
                onClick={() => {
                  handleFilterChange("size", "");
                  setShowSizeDropdown(false);
                }}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
              >
                All Sizes
              </div>
              {filterOptions.sizes.map((size: any) => (
                <div
                  key={size.key}
                  onClick={() => {
                    handleFilterChange("size", size.label);
                    setShowSizeDropdown(false);
                  }}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                >
                  {size.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Spinner />
        </div>
      ) : !loading && orders.length > 0 ? (
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
                    <p className="text-xs text-gray-500 lowercase">
                      {item.size}
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
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-center text-gray-500">
            {search && (filters.shirt || filters.color || filters.size)
              ? `No results found for "${search}" with current filters.`
              : search
                ? `No results found for "${search}".`
                : filters.shirt || filters.color || filters.size
                  ? `No results found for selected filters.`
                  : "No orders found."}
          </p>
        </div>
      )}

      <AnimatePresence>
        {modalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center m-0 bg-black bg-opacity-75"
            onClick={() => setModalImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-full max-h-full p-4"
            >
              <img
                src={modalImage}
                alt="Proof"
                className="object-contain max-h-[60vh] max-w-[60vw] rounded shadow-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrdersTable;
