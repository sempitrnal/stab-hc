import DefaultTemplate from "@/templates/default-template";
import { Product } from "@/types/product";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

const Home = ({ products }: { products: Product[] }) => {
  const [playing, setPlaying] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = ref.current;
    if (audio) {
      audio.volume = 1;
      // audio.play();
      // setPlaying(true);
      // Add event listener for when audio ends
      audio.addEventListener("ended", handleAudioEnded);
    }

    // Cleanup function to remove event listener
    return () => {
      if (audio) {
        audio.removeEventListener("ended", handleAudioEnded);
      }
    };
  }, []);
  const handleAudioEnded = () => {
    setPlaying(false);
    const audio = ref.current;
    audio?.play();
    setPlaying(true);
  };

  // const { data, loading, error } = useQuery(GET_HOMEPAGE);
  // if (loading) return <Loading />;
  console.log(products);
  return (
    <DefaultTemplate
      head={
        <Head>
          <title className="lowercase">
            stab.cult merch store | Juana Osmeña Hardcore
          </title>
          <meta
            name="description"
            content="Official merch store of stab.cult — a hardcore band from Juana Osmeña bringing raw, aggressive energy straight outta Cebu."
          />

          {/* Open Graph (Facebook, LinkedIn, etc.) */}
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="stab.cult merch store | juana osmeña hardcore"
          />
          <meta
            property="og:description"
            content="official merch store of stab.cult — a hardcore band from Juana Osmeña bringing raw, aggressive energy straight outta cebu."
          />
          <meta property="og:image" content="https://stabcult.com/dead.jpg" />
          <meta property="og:url" content="https://stabcult.com" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="stab.cult merch store | Juana Osmeña Hardcore"
          />
          <meta
            name="twitter:description"
            content="official merch store of stab.cult — a hardcore band from Juana Osmeña bringing raw, aggressive energy straight outta cebu."
          />
          <meta name="twitter:image" content="https://stabcult.com/dead.jpg" />

          <link rel="icon" href="/knife.ico" type="image/x-icon" />
        </Head>
      }
    >
      <main>
        <div className="w-full max-w-5xl min-h-screen p-4 mx-auto mt-4 sm:p-8 md:p-12">
          <h1 className="sticky top-0 z-10 mb-10 text-4xl font-light tracking-tight bg-white md:mb-20 text-start scroll-m-20 text-stone-800 text-balance">
            mertz
          </h1>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col gap-3 transition-all duration-300 ease-in-out cursor-pointer group"
                  onClick={() => {
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
      </main>
    </DefaultTemplate>

    // <audio ref={ref} src="/yea.m4a"></audio>

    // <div className="flex gap-2 mt-20">
    //   <FaFacebookSquare
    //     className="text-[2rem]  cursor-pointer transition-all duration-300 hover:text-stone-800"
    //     onClick={() => {
    //       window.open("https://www.facebook.com/stabzilog", "_blank");
    //     }}
    //   />
    //   <FaInstagram
    //     className="text-[2rem]  cursor-pointer transition-all duration-300 hover:text-stone-800"
    //     onClick={() => {
    //       window.open("https://www.instagram.com/stab.cult", "_blank");
    //     }}
    //   />
    //   <FaSpotify
    //     className="text-[2rem]  cursor-pointer transition-all duration-300 hover:text-stone-800"
    //     onClick={() => {
    //       window.open(
    //         "https://open.spotify.com/artist/7sCkooThtWgYUNIp07b73f?si=v_jKMjBTQ-iyB5W_8enL7A",
    //         "_blank"
    //       );
    //     }}
    //   />
    // </div>
    // <div className="mt-10 text-xs">made by bo, hells yeah!</div>
  );
};

export default Home;

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
