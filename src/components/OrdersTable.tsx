// OrdersTable.tsx
import { formatPrice } from "@/lib/utils";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import DesktopOrderRow from "./DesktopOrderRow";
import MobileOrderCard from "./MobileOrderCard";
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
  selectedOrders,
  setSelectedOrders,
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
  selectedOrders: string[];
  setSelectedOrders: (ids: string[]) => void;
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const router = useRouter();
  const [showShirtDropdown, setShowShirtDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
      <Popover.Button className="px-2 py-1 mt-2 text-xs lowercase bg-white border border-gray-300 rounded text-stone-900 hover:bg-gray-100 focus:outline-none ">
        {items.length > 0
          ? `${items[0].name} ${items.length > 1 ? `+${items.length - 1}` : ""}`
          : "No items"}
      </Popover.Button>
      <Popover.Panel className="absolute z-10 p-2 mt-2 overflow-y-auto bg-white border rounded shadow-md w-80 max-h-64">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-end gap-4 mb-2">
            <div className="relative rounded h-14 w-14 ">
              <Image
                width={100}
                height={100}
                alt=""
                src={item.image}
                className="object-cover "
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
  console.log(selectedOrders);
  return (
    <div className="w-full">
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
        showDeliveryDropdown={showDeliveryDropdown}
        setShowDeliveryDropdown={setShowDeliveryDropdown}
        page={metaPagination.page}
      />
      <div
        className={`flex items-center ${isEditing ? "justify-between lg:justify-end" : "justify-end"} mb-2`}
      >
        {isEditing && (
          <label
            htmlFor="select-all-orders"
            className="flex items-center gap-2 mr-2 cursor-pointer lg:hidden"
          >
            <input
              id="select-all-orders"
              type="checkbox"
              className="cursor-pointer"
              onChange={(e) => {
                if (e.target.checked) {
                  const allIds = orders.map((o) => o.id);
                  setSelectedOrders(allIds);
                } else {
                  setSelectedOrders([]);
                }
              }}
              checked={
                orders.length > 0 && selectedOrders.length === orders.length
              }
            />
            <p className="text-sm translate-y-[-2px]">select all</p>
          </label>
        )}
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            if (isEditing) {
              setSelectedOrders([]);
            } else {
              // If entering edit mode, select all orders by default
            }
          }}
          className="px-3 py-1 text-sm text-white bg-[#140a1f] rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? "Done" : "Edit"}
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[50vh]">
          <Spinner />
        </div>
      ) : orders.length > 0 ? (
        <div className="hidden lg:block">
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {isEditing && (
                  <th className="p-2 text-left">
                    <input
                      type="checkbox"
                      className="cursor-pointer"
                      onChange={(e) => {
                        if (e.target.checked) {
                          const allIds = orders.map((o) => o.id);
                          setSelectedOrders(allIds);
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                      checked={
                        orders.length > 0 &&
                        selectedOrders.length === orders.length
                      }
                    />
                  </th>
                )}
                <th className="p-2 text-left">Date</th>
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
              {orders.map((order) => (
                <DesktopOrderRow
                  key={order.id}
                  order={order}
                  isEditing={isEditing}
                  selectedOrders={selectedOrders}
                  setSelectedOrders={setSelectedOrders}
                  renderItemsCell={renderItemsCell}
                  formatPrice={formatPrice}
                  setModalImage={setModalImage}
                />
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
      <div className="space-y-4 lg:hidden">
        <div className="flex justify-end mb-2 "></div>
        {orders.map((order) => (
          <MobileOrderCard
            key={order.id}
            order={order}
            isEditing={isEditing}
            selectedOrders={selectedOrders}
            setSelectedOrders={setSelectedOrders}
            renderItemsCell={renderItemsCell}
          />
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
