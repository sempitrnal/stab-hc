import Image from "next/image";

const DesktopOrderRow = ({
  order,
  isEditing,
  selectedOrders,
  setSelectedOrders,
  renderItemsCell,
  formatPrice,
  setModalImage,
}: {
  order: any;
  isEditing: boolean;
  selectedOrders: string[];
  setSelectedOrders: (ids: string[]) => void;
  renderItemsCell: (items: any[]) => JSX.Element;
  formatPrice: (value: number) => string;
  setModalImage: (url: string) => void;
}) => {
  const isSelected = selectedOrders.includes(order.id);

  return (
    <tr
      className={`border-t ${
        isSelected
          ? "bg-blue-100 border-blue-500"
          : isEditing
            ? "bg-gray-50"
            : ""
      }`}
    >
      {isEditing && (
        <td className="p-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedOrders([...selectedOrders, order.id]);
              } else {
                setSelectedOrders(
                  selectedOrders.filter((id) => id !== order.id)
                );
              }
            }}
          />
        </td>
      )}
      <td className="p-2">
        {new Date(order.createdAt).toLocaleString("en-PH", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </td>
      <td className="p-2">{order.orderId}</td>
      <td className="p-2">
        {order.firstName} {order.lastName}
      </td>
      <td className="p-2">{order.email}</td>
      <td className="p-2">{order.contactNumber}</td>
      <td className="p-2">
        {order.deliveryMethod === "ship" ? order.address.city : "Pick up"}
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
  );
};

export default DesktopOrderRow;
