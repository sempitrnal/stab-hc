export const orderStatuses = [
  {
    key: "preorder",
    color: "bg-yellow-300",
    label: "Preorder",
  },
  {
    key: "processing",
    color: "bg-blue-300",
    label: "Processing",
  },
  {
    key: "completed",
    color: "bg-green-300",
    label: "Completed",
  },
  {
    key: "ready_for_pickup",
    color: "bg-purple-300 ",
    label: "Ready for Pickup",
  },
  {
    key: "ready_for_delivery",
    color: "bg-orange-300",
    label: "Ready for Delivery",
  },
];
const OrderStatus = ({ status }: { status: string }) => {
  const orderStatus = orderStatuses.find((s) => s.key === status);
  if (!orderStatus) return null;
  return (
    <div
      className={`rounded p-1 px-2 ${orderStatus.color} text-[#252525] max-w-fit h-7 font-semibold text-[.75rem] lowercase`}
    >
      {orderStatus.label}
    </div>
  );
};

export default OrderStatus;
