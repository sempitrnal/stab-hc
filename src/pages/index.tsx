import Stab from "@/components/Stab";
import { motion } from "framer-motion";
import Head from "next/head";
import { Suspense, useEffect, useRef } from "react";
const Loading = () => {
  return (
    <div className="w-[500px] h-[200px] flex justify-center items-center">
      <p className="font-mono leading-loose tracking-widest text-center">
        Loading...
      </p>
    </div>
  );
};
const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <Head>
        <title>stab hc</title>
      </Head>
      <Suspense fallback={<Loading />}>
        <Stab />
      </Suspense>
      <audio src="/yea.m4a" autoPlay></audio>
      <div className="w-full md:w-[30rem] px-10 md:px-0">
        <div className="flex flex-col gap-8 font-mono text-center">
          <p className="text-lg leading-loose tracking-widest ">
            juana osmeña hardcore
          </p>
          <p className="text-sm leading-loose tracking-widest">
            stab is a brutal hardcore band with relentless energy and
            unapologetic intensity, we deliver a raw and powerful sound that
            hits hard and leaves a lasting impression. Our lineup includes Irish
            on vocals, Daryl on bass, Bo and Jofel on guitars, and Arxan on
            drums. Together, {"we're"} here to bring the noise and show the
            world what hardcore music is all about. But for us, hardcore is more
            than just music — {"it's "}a way of life. {"It's"} about resilience,
            passion, and standing up for what you believe in, no matter the
            odds.
          </p>
          <p className="text-xs leading-loose tracking-widest">
            be yourself lang maws
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
