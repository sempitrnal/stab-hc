import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  productId: string;
};

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addToCart: (item, quantity = 1) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.size === item.size
        );

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...get().items, { ...item, quantity }],
          });
        }
      },

      removeFromCart: (id, size) => {
        set({
          items: get().items.filter((i) => !(i.id === id && i.size === size)),
        });
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id, size);
        } else {
          set({
            items: get().items.map((i) =>
              i.id === id && i.size === size ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        ),
    }),
    {
      name: "cart-storage", // key in localStorage
      partialize: (state) => ({
        items: state.items,
        isOpen: false, // 🧠 reset drawer to closed on reload
      }),
    }
  )
);
