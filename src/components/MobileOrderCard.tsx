import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import OrderStatus from "./OrderStatus";

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  hidden: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -2 },
  visible: { opacity: 1, y: 0 },
};

const MobileOrderCard = ({
  order,
  isEditing,
  selectedOrders,
  setSelectedOrders,
  renderItemsCell,
}: {
  order: any;
  isEditing: boolean;
  selectedOrders: string[];
  setSelectedOrders: (ids: string[]) => void;
  renderItemsCell: (items: any[]) => JSX.Element;
}) => {
  const [isOpen, setIsOpen] = useState(
    isEditing || selectedOrders.includes(order.id)
  );

  const isSelected = selectedOrders.includes(order.id);

  const handleClick = () => {
    if (!isEditing) return;

    if (isSelected) {
      setSelectedOrders(selectedOrders.filter((id) => id !== order.id));
    } else {
      setSelectedOrders([...selectedOrders, order.id]);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border flex row w-full rounded shadow-sm ${
        isSelected
          ? "bg-blue-100 border-blue-500"
          : isEditing
            ? "bg-gray-50 cursor-pointer"
            : "bg-white"
      }`}
    >
      <div className="w-full">
        {isEditing && (
          <input
            type="checkbox"
            className="mb-2 cursor-pointer"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              if (e.target.checked) {
                setSelectedOrders([...selectedOrders, order.id]);
              } else {
                setSelectedOrders(
                  selectedOrders.filter((id) => id !== order.id)
                );
              }
            }}
          />
        )}

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center w-full gap-2">
            <p className="flex-shrink-0 text-sm font-semibold">
              {order.orderId}
            </p>
            <div
              className={`${
                order.deliveryMethod === "pickup"
                  ? "bg-green-300"
                  : "bg-red-300"
              } text-[.75rem] px-2 py-1 rounded text-[#252525] font-semibold lowercase flex-shrink-0`}
            >
              {order.deliveryMethod}
            </div>
          </div>
          <div className="flex-shrink-0">
            <OrderStatus status={order.orderStatus} />
          </div>
        </div>

        <p className="text-sm">
          {order.firstName} {order.lastName}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="flex items-center gap-1 mt-2 text-xs transition-opacity text-stone-900 hover:opacity-80"
        >
          {isOpen ? "hide details" : "show details"}
          <span
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <IoIosArrowDown className="w-4 h-4" />
          </span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              className="mt-2 space-y-1"
              style={{ overflow: "hidden" }}
              variants={containerVariants}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <motion.p
                className="text-xs text-gray-500"
                variants={itemVariants}
              >
                {order.email}
              </motion.p>
              <motion.p
                className="text-xs text-gray-500"
                variants={itemVariants}
              >
                {order.contactNumber}
              </motion.p>
              <motion.p className="text-xs italic" variants={itemVariants}>
                {order.deliveryMethod === "ship"
                  ? `${order.address.city}`
                  : "Pick up"}
              </motion.p>
              <motion.p className="text-xs capitalize" variants={itemVariants}>
                {order.paymentMethod}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div variants={itemVariants}>
          {renderItemsCell(order.items)}
        </motion.div>
        <p className="mt-2 text-xs font-medium">₱{order.total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default MobileOrderCard;
