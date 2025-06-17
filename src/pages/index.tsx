import Hero from "@/components/Hero";
import ProductCarousel from "@/components/ProductCarousel";
import useGlobalLoadingStore from "@/stores/loading";
import DefaultTemplate from "@/templates/default-template";
import { Product } from "@/types/product";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
const Home = ({ products }: { products: Product[] }) => {
  const [playing, setPlaying] = useState(false);
  const [clickedProductSlug, setClickedProductSlug] = useState<string | null>(
    null
  );
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
  const { setLoading, loading } = useGlobalLoadingStore();
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <DefaultTemplate
      head={
        <Head>
          <title>stab.cult | juana osmeña hardcore</title>
          <meta
            name="description"
            content="stab.cult official — juana osmeña hardcore gaw. tees, gear, and underground spirit from cebu."
          />

          <link rel="canonical" href="https://www.stabcult.com" />

          {/* open graph */}
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="stab.cult | juana osmeña hardcore"
          />
          <meta
            property="og:description"
            content="stab.cult official — juana osmeña hardcore gaw. tees, gear, and underground spirit from cebu."
          />
          <meta
            property="og:image"
            content="https://www.stabcult.com/dead.jpg"
          />
          <meta property="og:url" content="https://www.stabcult.com" />

          {/* twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="stab.cult | juana osmeña hardcore"
          />
          <meta
            name="twitter:description"
            content="stab.cult official — juana osmeña hardcore gaw. tees, gear, and underground spirit from cebu."
          />
          <meta
            name="twitter:image"
            content="https://www.stabcult.com/dead.jpg"
          />

          {/* json-ld schema */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Store",
                name: "stab.cult",
                url: "https://www.stabcult.com",
                description: "stab.cult — juana osmeña hardcore gaw from cebu.",
                image: "https://www.stabcult.com/dead.jpg",
                logo: "https://www.stabcult.com/knife.ico",
                sameAs: [
                  "https://instagram.com/stab.cult",
                  "https://facebook.com/stab.cult",
                ],
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "cebu city",
                  addressRegion: "cebu",
                  addressCountry: "ph",
                },
              }),
            }}
          />
        </Head>
      }
    >
      <main className="">
        <Hero />
        <div className="w-full max-w-5xl min-h-screen p-5 px-5 mx-auto mt-5 md:p-0">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h1 className="z-10 text-4xl font-light tracking-tight text-start text-stone-800 text-balance">
              merch
            </h1>
            <Link
              href={`/merch`}
              scroll={false}
              className="px-4 py-1 text-sm font-semibold text-[#9679ff] border rounded -md border-[#9679ff] hover:bg-[#9679ff] hover:text-white transition-colors duration-300 ease-in-out"
              onClick={() => {
                setClickedProductSlug(null);
                setLoading(true);
              }}
            >
              view all
            </Link>
          </div>
          <ProductCarousel
            products={products}
            setClickedProductSlug={setClickedProductSlug}
          />
        </div>
      </main>
    </DefaultTemplate>

    // <audio ref={ref} src="/yea.m4a"></audio>
  );
};

export default Home;

export const getStaticProps = async () => {
  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/products?populate=*&pagination[limit]=6`
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
