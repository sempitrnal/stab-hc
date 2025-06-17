import useGlobalLoadingStore from "@/stores/loading";
import { useCartStore } from "@/stores/useCartStore";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";

const CartDrawer = () => {
  const {
    items,
    isOpen,
    closeCart,
    totalPrice,
    removeFromCart,
    updateQuantity,
  } = useCartStore();
  const router = useRouter();
  const { setLoading } = useGlobalLoadingStore();
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 z-[9999] flex flex-col h-full bg-white shadow-lg w-80"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold lowercase">Your Cart</h2>
              <button onClick={closeCart}>✕</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 lowercase">
                  Your cart is empty.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="pb-2 mb-4 border-b"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        width={96}
                        height={96}
                        src={item.image}
                        alt={item.name}
                        className="object-cover w-24 h-24 rounded"
                      />
                      <div className="flex-1 gap-5">
                        <p className="font-light lowercase text-normal">
                          {item.name}
                        </p>
                        <p className={`text-xs uppercase text-gray-500 `}>
                          {item.color}
                        </p>
                        <p className="text-xs text-gray-400 lowercase">
                          size: {item.size}
                        </p>
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="w-6 text-sm text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <p className="mt-3 text-sm font-light ">
                          ₱
                          {new Intl.NumberFormat("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }).format(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t">
                <p className="mb-2 font-light lowercase">
                  Total: ₱
                  {new Intl.NumberFormat("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(totalPrice())}
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    setTimeout(() => {
                      router.push("/checkout", undefined, {
                        scroll: false,
                      });
                    }, 500);
                  }}
                  className="w-full py-2 text-white lowercase bg-black rounded hover:bg-gray-800"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
