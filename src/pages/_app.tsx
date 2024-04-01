import Nav from "@/components/Nav";
import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
export default function App({ Component, pageProps, router }: AppProps) {
  const route = router;
  return (
    <>
      <AnimatePresence initial={true} mode="wait">
        <Component key={route.asPath} {...pageProps} />
      </AnimatePresence>
    </>
  );
}
