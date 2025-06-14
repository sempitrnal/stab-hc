import { useCartStore } from "@/stores/useCartStore";
import { useHasHydrated } from "@/stores/useHasHydrated";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { FiHome, FiSearch, FiShoppingCart } from "react-icons/fi";
import Stab from "./Stab";
const Loading = () => {
  return (
    <div className="w-full h-[150px] flex justify-center items-center">
      <p className="font-mono leading-loose tracking-widest text-center">
        Loading...
      </p>
    </div>
  );
};

const CartButton = () => {
  const openCart = useCartStore((s) => s.openCart);
  const totalItems = useCartStore((s) => s.totalItems());
  const hasHydrated = useHasHydrated();

  return (
    <li
      onClick={openCart}
      className="relative transition-colors duration-300 cursor-pointer hover:text-stone-600"
    >
      <FiShoppingCart className="text-2xl" />
      {hasHydrated && totalItems > 0 && (
        <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1.5 -right-1.5">
          {totalItems}
        </span>
      )}
    </li>
  );
};
const Nav = () => {
  const router = useRouter();
  return (
    <nav className="sticky top-0 z-50 w-full h-32 bg-white border-b drop-shadow-[#616161_0px_1px_1px_rgba(79, 79, 79, 0.05)]">
      <div className="flex items-center justify-between px-5 pt-1 lg:px-20">
        <p className="hidden px-3 text-lg leading-loose tracking-widest text-center rounded-md w-max sm:block"></p>
        <Suspense fallback={<Loading />}>
          <Stab />
        </Suspense>
        <div className="flex items-end gap-5 row">
          <ul className="flex items-center gap-2 text-2xl">
            <li
              onClick={() => router.push("/", undefined, { scroll: false })}
              className="transition-colors duration-300 cursor-pointer hover:text-stone-600"
            >
              <FiHome />
            </li>
            <li className="transition-colors duration-300 cursor-pointer hover:text-stone-600">
              <FiSearch />
            </li>
            <CartButton />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
