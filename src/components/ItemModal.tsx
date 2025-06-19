import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

const ItemModal = ({
  editItemModal,
  setEditItemModal,
  orders,
}: {
  editItemModal: any;
  setEditItemModal: (value: any) => void;
  orders: any[];
}) => {
  return (
    <AnimatePresence>
      {editItemModal &&
        (() => {
          // Local state for selectedColor, initialized with current color
          const [selectedColor, setSelectedColor] = useState(
            editItemModal?.item.color || ""
          );
          return (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-white p-4 rounded shadow-lg w-[90%] max-w-md">
                <h2 className="mb-4 text-lg font-semibold">Edit Item</h2>
                <label className="block mb-2 text-sm">Color</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full p-2 mb-4 border rounded"
                >
                  {editItemModal.product.color.map(
                    (color: { key: string; hex: string; name: string }) => (
                      <option key={color.key} value={color.key}>
                        {color.name}
                      </option>
                    )
                  )}
                </select>
                <label className="block mb-2 text-sm">Size</label>
                <select
                  value={editItemModal.item.size}
                  className="w-full p-2 mb-4 border rounded"
                >
                  {Object.entries(editItemModal.product.size_chart).map(
                    ([key, size]) => {
                      const typedSize = size as {
                        key: string;
                        label: string;
                      };
                      return (
                        <option key={key} value={typedSize.key}>
                          {typedSize.label}
                        </option>
                      );
                    }
                  )}
                </select>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setEditItemModal(null)}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      const updatedItem = {
                        ...editItemModal.item,
                        color: selectedColor,
                        size: editItemModal.item.size,
                      };
                      const updatedItems = [
                        ...orders[editItemModal.orderIndex].items,
                      ];
                      updatedItems[editItemModal.itemIndex] = updatedItem;
                      console.log("Updated Items:", updatedItems);
                      try {
                        await fetch(`/api/orders/${editItemModal.orderId}`, {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            data: { items: updatedItems },
                          }),
                        });
                        setEditItemModal(null);
                        toast.success("Item updated successfully");
                      } catch (error) {
                        setEditItemModal(null);
                        toast.error("Failed to update item");
                      }
                    }}
                    className="px-3 py-1 text-white bg-black rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })()}
    </AnimatePresence>
  );
};

export default ItemModal;
