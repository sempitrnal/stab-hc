import { motion } from "framer-motion";
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
      <Link href="/">Back</Link>
      <h1 className="text-[2rem]">aiko hell yeah 👋🏽</h1>
      <div className="flex items-center gap-5 mt-24">
        <video
          className=""
          autoPlay
          loop
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
      <div className="flex flex-col items-center gap-5 mt-28">
        <p className="font-mono">hi aiko, u are the best {"<3"}</p>
      </div>
    </motion.div>
  );
}

export default Hello;
