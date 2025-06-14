import CartDrawer from "@/components/CartDrawer";
import Nav from "@/components/Nav";
import "@/styles/globals.css";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
export default function App({ Component, pageProps, router }: AppProps) {
  const route = router;

  return (
    <>
      {!route.pathname.includes("/portal") && <Nav />}
      <AnimatePresence
        initial={true}
        mode="wait"
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <motion.div
          key={router.asPath}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onAnimationComplete={() => {
            window.scrollTo({ top: 0, behavior: "instant" });
          }}
        >
          <Component key={route.pathname} {...pageProps} />
        </motion.div>
        <CartDrawer />
        <Toaster position="bottom-center" />
      </AnimatePresence>
    </>
  );
}
