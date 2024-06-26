import Stab from "@/components/Stab";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  FaFacebookSquare,
  FaInstagram,
  FaPause,
  FaPlay,
  FaSpotify,
} from "react-icons/fa";
import { withAuthConsumerAnonMixed } from "../../hoc/WithAuthConsumerAnonMixed";
const Loading = () => {
  return (
    <div className="w-full h-[150px] flex justify-center items-center">
      <p className="font-mono leading-loose tracking-widest text-center">
        Loading...
      </p>
    </div>
  );
};
const Home = () => {
  const [playing, setPlaying] = useState(false);
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
    // Do whatever you need to do when audio finishes playing
  };

  // const { data, loading, error } = useQuery(GET_HOMEPAGE);
  // if (loading) return <Loading />;
  // console.log(data);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center w-full pb-10 h-max"
    >
      <audio ref={ref} src="/yea.m4a"></audio>
      <Head>
        <title>stab.cult</title>
        <meta
          name="description"
          content="stab is a heavy hardcore band
            with relentless energy and unapologetic intensity, we deliver a raw
            and powerful sound that hits hard and leaves a lasting impression."
        />
        <meta property="og:title" content="stab.cult" />
        <meta
          property="og:description"
          content="stab is a heavy hardcore band
          with relentless energy and unapologetic intensity, we deliver a raw
          and powerful sound that hits hard and leaves a lasting impression."
        />
        <meta property="og:image" content="/dead.jpg" />
        <link rel="shortcut icon" href="knife.ico" type="image/x-icon" />
      </Head>
      <Suspense fallback={<Loading />}>
        <Stab />
      </Suspense>
      <Image src={"/arxan.jpg"} width={250} height={250} alt="500" />
      <div className="w-full md:w-[30rem] px-10  md:px-0 mt-5">
        <div className="flex flex-col items-center gap-8 font-mono text-justify">
          <p className="px-3 text-lg leading-loose tracking-widest text-center border rounded-md w-max ">
            juana osmeña hardcore
          </p>
          <p className="text-sm leading-loose tracking-widest lowercase">
            <span className="font-bold">stab </span> is a heavy hardcore band
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
              "https://open.spotify.com/artist/7sCkooThtWgYUNIp07b73f?si=v_jKMjBTQ-iyB5W_8enL7A",
              "_blank"
            );
          }}
        />
      </div>
      <div className="mt-10 text-xs">made by bo, hells yeah!</div>
    </motion.div>
  );
};

export default withAuthConsumerAnonMixed(Home);
