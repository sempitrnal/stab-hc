import CartDrawer from "@/components/CartDrawer";
import GlobalLoadingOverlay from "@/components/GlobalLoadingOverlay";
import Nav from "@/components/Nav";
import useGlobalLoadingStore from "@/stores/loading";
import "@/styles/globals.css";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
export default function App({ Component, pageProps, router }: AppProps) {
  const route = router;
  const { setLoading, loading } = useGlobalLoadingStore();
  return (
    <>
      {!route.pathname.includes("/portal") && <Nav />}

      <AnimatePresence
        initial={false}
        mode="wait"
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <motion.div
          key={router.asPath}
          initial={{ opacity: 0, y: loading ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: loading ? 0 : -20 }}
          className="relative "
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onAnimationComplete={() => {
            window.scrollTo({ top: 0, behavior: "instant" });
            setLoading(false);
          }}
        >
          <Component key={route.pathname} {...pageProps} />
          <GlobalLoadingOverlay />
        </motion.div>
        <CartDrawer />
        <Toaster position="bottom-center" />
      </AnimatePresence>
    </>
  );
}
