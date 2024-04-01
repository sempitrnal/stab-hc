import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

function Hello() {
  const route = useRouter();
  return (
    <motion.div
      className="p-10"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      <Head>
        <title>biko</title>
        <meta name="description" content="bo and aiko best couple 💗💗💗" />
        <meta property="og:title" content="bo and aiko = biko 🍚" />
        <meta property="og:description" content="bo and aiko = biko 🍚." />
        <meta property="og:image" content="/biko/high.jpg" />
      </Head>
      <Link href="/">Back</Link>
      <h1 className="text-[2rem]">aiko hell yeah 👋🏽</h1>
      <div className="flex items-center gap-5 mt-24">
        <video
          className=""
          autoPlay
          loop
          playsInline
          style={{ width: "", height: "500px" }}
        >
          <source src="/biko/biko.webm" />
        </video>
        <p className="">bo and aiko best couple 💗💗💗</p>
      </div>
      <div className="flex flex-col items-center gap-5 mt-10">
        <p className="">eepy bo & aiko</p>
        <Image
          className="rounded-md"
          src="/biko/biko-sleep.jpeg"
          width={250}
          height={200}
          alt="biko"
        />
      </div>
      <div className="flex flex-col items-center gap-5 mt-16">
        <p className="">my pretty girl {"<3"}</p>
        <Image
          className="rounded-md"
          src="/biko/aiko.jpeg"
          width={250}
          height={200}
          alt="biko"
        />
      </div>
      <div className="mt-5">
        <hr />
      </div>
      <div className="flex flex-col items-center gap-5 text-sm mt-28">
        <p className="font-mono text-center">
          hi aiko, u are the best n u deserve all the good things in tha whole
          wide world {"<3"} ily {"   "}
          🙂↕️🙂↕️🙂↕️
        </p>
        <small>p.s. ion have the emoji yet 😭</small>
      </div>
    </motion.div>
  );
}

export default Hello;
