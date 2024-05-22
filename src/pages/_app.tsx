import Nav from "@/components/Nav";
import "@/styles/globals.css";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AnimatePresence } from "framer-motion";
import type { AppProps } from "next/app";
export default function App({ Component, pageProps, router }: AppProps) {
  const route = router;
  const client = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_SLYDYN_WORDPRESS_GRAPHQL,

    cache: new InMemoryCache(),
  });
  return (
    <>
      <AnimatePresence initial={true} mode="wait">
        <ApolloProvider client={client}>
          <Component key={route.asPath} {...pageProps} />
        </ApolloProvider>
      </AnimatePresence>
    </>
  );
}
