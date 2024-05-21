import Stab from "@/components/Stab";
import { AnimatePresence, motion } from "framer-motion";
import Head from "next/head";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  FaPlay,
  FaPause,
  FaFacebook,
  FaFacebookSquare,
  FaInstagramSquare,
  FaInstagram,
  FaSpotify,
} from "react-icons/fa";
const Loading = () => {
  return (
    <div className="w-full h-[150px] flex justify-center items-center">
      <p className="font-mono leading-loose tracking-widest text-center">
        Loading...
      </p>
    </div>
  );
};
export async function fetchMetadata() {
  const response = await fetch(
    `https://664ca01635bbda1098812dc2.mockapi.io/products`
  );
  const data = await response.json();

  if (data.length === 0) {
    return null;
  }

  const product = data[0];

  return {
    pageTitle: product.title,
    pageDescription: product.description,

    otherMetaTags: [
      { property: "og:title", content: product.title },
      { property: "og:description", content: product.description },
      { property: "og:image", content: product.img },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: product.title },
      { name: "twitter:description", content: product.description },
      { name: "twitter:image", content: product.img },
    ],
  };
}
const Home = ({ metadata }: { metadata: any }) => {
  console.log(metadata);
  const [seo, setSeo] = useState<any>();
  async function fetchDescription() {
    const res = await fetch(
      "https://664ca01635bbda1098812dc2.mockapi.io/products"
    );
    const data = await res.json();
    setSeo(data[0]);
  }
  useEffect(() => {
    fetchDescription();
  }, []);
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = ref.current;
    if (audio) {
      audio.volume = 0.1;
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
    // Do whatever you need to do when audio finishes playing
  };
  if (!seo) return <Loading />;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center w-full pb-10 h-max"
    >
      <audio ref={ref} src="/yea.m4a"></audio>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:image" content={seo.img} />
        <link rel="shortcut icon" href="knife.ico" type="image/x-icon" />
      </Head>
      <Suspense fallback={<Loading />}>
        <Stab />
      </Suspense>

      <div className="w-full md:w-[30rem] px-10  md:px-0 mt-5">
        <div className="flex flex-col items-center gap-8 font-mono text-justify">
          <p className="px-3 text-lg leading-loose tracking-widest text-center border rounded-md w-max ">
            juana osmeña hardcore
          </p>
          <p className="text-sm leading-loose tracking-widest lowercase">
            <span className="font-bold">stab </span> is a brutal hardcore band
            with relentless energy and unapologetic intensity, we deliver a raw
            and powerful sound that hits hard and leaves a lasting impression.
            Our lineup includes <span className="font-bold">Irish</span> on
            vocals, <span className="font-bold">Daryl</span> on bass,{" "}
            <span className="font-bold">Bo</span> and{" "}
            <span className="font-bold">Jofel</span> on guitars, and{" "}
            <span className="font-bold">Arxan</span> on drums. Together,{" "}
            {"we're"} here to bring the noise and show the world what hardcore
            music is all about. But for us, hardcore is more than just music —{" "}
            {"it's "}a way of life. {"It's"} about resilience, passion, and
            standing up for what you believe in, no matter the odds.
          </p>
          <p className="text-xs leading-loose tracking-widest">
            be yourself lang maws
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-16">
        <div className="text-xl transition-all duration-300 cursor-pointer hover:text-stone-600 ">
          {playing ? (
            <FaPause
              onClick={() => {
                ref.current?.pause();
                setPlaying(false);
              }}
            />
          ) : (
            <FaPlay
              onClick={() => {
                ref.current?.play();
                setPlaying(true);
              }}
            />
          )}
        </div>
        <div className="relative">
          {" "}
          {playing && (
            <motion.p>{"playing the most fire song rn! 🔥🔥🔥"}</motion.p>
          )}{" "}
          {!playing && <motion.p>{"play the most fire song ever 😠"}</motion.p>}
        </div>
      </div>
      <div className="flex gap-2 mt-20">
        <FaFacebookSquare
          className="text-[2rem] text-black cursor-pointer transition-all duration-300 hover:text-stone-800"
          onClick={() => {
            window.open("https://www.facebook.com/stabzilog", "_blank");
          }}
        />
        <FaInstagram
          className="text-[2rem] text-black cursor-pointer transition-all duration-300 hover:text-stone-800"
          onClick={() => {
            window.open("https://www.instagram.com/stab.cult", "_blank");
          }}
        />
        <FaSpotify
          className="text-[2rem] text-black cursor-pointer transition-all duration-300 hover:text-stone-800"
          onClick={() => {
            window.open(
              "https://open.spotify.com/track/4PTG3Z6ehGkBFwjybzWkR8?si=46763bd7772543d1",
              "_blank"
            );
          }}
        />
      </div>
      <div className="mt-10 text-xs">made by bo, hells yeah!</div>
    </motion.div>
  );
};
export async function getStaticProps(context: any) {
  const metadata = await fetchMetadata();

  if (!metadata) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      metadata,
    },
    revalidate: 10, // revalidate at most once every 10 seconds
  };
}

export default Home;
