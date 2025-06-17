import useGlobalLoadingStore from "@/stores/loading";
import { Product } from "@/types/product";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import router from "next/router";
import { useEffect, useState } from "react";

const MerchPage = ({ products }: { products: Product[] }) => {
  const [clickedProductSlug, setClickedProductSlug] = useState<string | null>(
    null
  );
  const { setLoading, loading } = useGlobalLoadingStore();
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div className="max-w-5xl px-4 py-12 mx-auto">
      <Head>
        <title>stab.cult | merch</title>
        <meta
          name="description"
          content="hrab stab.cult tees, gear, and underground hardcore merch straight from cebu."
        />
        <meta property="og:title" content="stab.cult | merch" />
        <meta
          property="og:description"
          content="grab stab.cult tees, gear, and underground hardcore merch straight from Cebu."
        />
        <meta property="og:url" content="https://www.stabcult.com/merch" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.stabcult.com/dead.jpg" />
        <link rel="canonical" href="https://www.stabcult.com/merch" />
      </Head>

      <h1 className="mb-8 text-3xl tracking-tight ">merch</h1>
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => {
          return (
            <div
              key={index}
              className="flex flex-col gap-3 transition-all duration-300 ease-in-out cursor-pointer group"
              onClick={() => {
                setClickedProductSlug(product.slug);
                setLoading(true);
                router.push(`/product/${product.slug}`, undefined, {
                  scroll: false,
                });
              }}
            >
              <div className="relative w-full aspect-[4/4] overflow-hidden rounded-md">
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 1 }}
                  whileHover={{ opacity: product.images[1] ? 0 : 1 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {product.images[1] && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <Image
                      src={product.images[1].url}
                      alt={product.name + " (hover image)"}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-light tracking-tight text-[#282828] scroll-m-20 underline-offset-4 group-hover:underline">
                    {product.name.toLowerCase()}
                  </p>
                  {product.preorder && (
                    <span className="px-2 py-1 text-xs font-semibold text-white no-underline lowercase translate-y-0.5 bg-yellow-400 rounded group-hover:no-underline">
                      preorder
                    </span>
                  )}
                </div>

                <p className="text-sm font-extralight">
                  ₱
                  {new Intl.NumberFormat("en-PH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(product.price)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MerchPage;

export const getStaticProps = async () => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/products?populate=*`
    );

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return { notFound: true };
    }

    const data = await res.json();
    console.log("Fetched products:", data);

    return {
      props: {
        products: data.data,
      },
      revalidate: 10,
    };
  } catch (err) {
    console.error("Fetch threw an error:", err);
    return { notFound: true };
  }
};
