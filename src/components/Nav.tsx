import useGlobalLoadingStore from "@/stores/loading";
import { useCartStore } from "@/stores/useCartStore";
import { useHasHydrated } from "@/stores/useHasHydrated";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FiHome, FiSearch, FiShoppingCart } from "react-icons/fi";
import { Spinner } from "./ui/Spinner";

const Stab = dynamic(() => import("./Stab"), {
  ssr: false,
  loading: () => <Loading />,
});
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[80px] w-[50px] ">
      <Spinner />
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
  const { setLoading } = useGlobalLoadingStore();

  return (
    <nav className=" sticky top-0 z-[9998] w-full h-20   bg-white px-5 lg:px-0 border-b  ">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="">
          <Stab />
        </div>

        <div className="flex items-end gap-5 row">
          <ul className="flex items-center gap-2 text-2xl">
            <li
              onClick={() => {
                if (router.pathname === "/") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  router.push("/", undefined, { scroll: false });
                  setLoading(true);
                }
              }}
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
