// OrdersTable.tsx
import { formatPrice } from "@/lib/utils";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import OrdersTableFilters from "./OrdersTableFilters";
import { Spinner } from "./ui/Spinner";

const OrdersTable = ({
  orders,
  search,
  setSearch,
  filters,
  filterOptions,
  setFilters,
  loading,
  metaPagination,
  onPageChange,
}: {
  orders: any[];
  search: string;
  setSearch: (value: string) => void;
  filters: any;
  setFilters: any;
  filterOptions: any;
  loading: boolean;
  metaPagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();
  const [showShirtDropdown, setShowShirtDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
    onPageChange(1);
    const params = new URLSearchParams(window.location.search);
    value ? params.set(key, value) : params.delete(key);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
  };

  const renderItemsCell = (items: any[]) => (
    <Popover className="relative">
      <Popover.Button className="text-xs text-blue-600 underline">
        {items.length > 0
          ? `${items[0].name} ${items.length > 1 ? `+${items.length - 1}` : ""}`
          : "No items"}
      </Popover.Button>
      <Popover.Panel className="absolute z-10 p-2 mt-2 overflow-y-auto bg-white border rounded shadow-md w-80 max-h-64">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-2">
            <div className="relative w-14 h-14">
              <Image
                width={100}
                height={100}
                alt=""
                src={item.image}
                className="object-cover rounded"
              />
              <div className="absolute top-[-8px] right-[-8px]">
                <p className="flex items-center justify-center w-4 h-4 text-xs font-semibold text-white bg-purple-900 rounded-full">
                  {item.quantity}
                </p>
              </div>
            </div>
            <div className="text-xs">
              <p className="font-medium lowercase">{item.name}</p>
              <p className="text-gray-500 uppercase">{item.color}</p>
              <p className="text-gray-500 lowercase">{item.size}</p>
              <p>{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </Popover.Panel>
    </Popover>
  );

  return (
    <div className="w-full">
      {/* existing search/filter UI... */}
      <OrdersTableFilters
        search={search}
        setSearch={setSearch}
        filters={filters}
        setFilters={setFilters}
        filterOptions={filterOptions}
        showShirtDropdown={showShirtDropdown}
        setShowShirtDropdown={setShowShirtDropdown}
        showColorDropdown={showColorDropdown}
        setShowColorDropdown={setShowColorDropdown}
        showSizeDropdown={showSizeDropdown}
        setShowSizeDropdown={setShowSizeDropdown}
        handleFilterChange={handleFilterChange}
        onPageChange={onPageChange}
        page={metaPagination.page}
      />
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Spinner />
        </div>
      ) : orders.length > 0 ? (
        <div className="hidden md:block">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Order ID</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Contact</th>
                <th className="p-2 text-left">Delivery</th>
                <th className="p-2 text-left">Payment</th>
                <th className="p-2 text-left">Items</th>
                <th className="p-2 text-left">Total</th>
                <th className="p-2 text-left">Proof</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{order.orderId}</td>
                  <td className="p-2">
                    {order.firstName} {order.lastName}
                  </td>
                  <td className="p-2">{order.email}</td>
                  <td className="p-2">{order.contactNumber}</td>
                  <td className="p-2">
                    {order.deliveryMethod === "ship"
                      ? `${order.address.city}`
                      : "Pick up"}
                  </td>
                  <td className="p-2 capitalize">{order.paymentMethod}</td>
                  <td className="p-2">{renderItemsCell(order.items)}</td>
                  <td className="p-2">{formatPrice(order.total)}</td>
                  <td className="p-2">
                    {order.proof && (
                      <Image
                        width={32}
                        height={32}
                        src={order.proof.url}
                        alt="Proof"
                        className="object-cover rounded cursor-pointer"
                        onClick={() => setModalImage(order.proof.url)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={metaPagination.page === 1}
              onClick={() => onPageChange(metaPagination.page - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1">
              Page {metaPagination.page} of {metaPagination.pageCount}
            </span>
            <button
              disabled={metaPagination.page === metaPagination.pageCount}
              onClick={() => onPageChange(metaPagination.page + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
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

      {/* Mobile Compact View */}
      <div className="space-y-4 md:hidden">
        {orders.map((order, idx) => (
          <div key={idx} className="p-4 border rounded shadow-sm">
            <p className="text-sm font-semibold">{order.orderId}</p>
            <p className="text-sm">
              {order.firstName} {order.lastName}
            </p>
            <p className="text-xs text-gray-500">{order.email}</p>
            <p className="text-xs text-gray-500">{order.contactNumber}</p>
            <p className="text-xs italic">
              {order.deliveryMethod === "ship"
                ? `${order.address.city}`
                : "Pick up"}
            </p>
            <p className="text-xs capitalize">{order.paymentMethod}</p>
            <div className="">{renderItemsCell(order.items)}</div>
            <p className="mt-2 text-xs font-medium">
              ₱{order.total.toFixed(2)}
            </p>
          </div>
        ))}
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={metaPagination.page === 1}
            onClick={() => onPageChange(metaPagination.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-2 py-1">
            Page {metaPagination.page} of {metaPagination.pageCount}
          </span>
          <button
            disabled={metaPagination.page === metaPagination.pageCount}
            onClick={() => onPageChange(metaPagination.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

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
