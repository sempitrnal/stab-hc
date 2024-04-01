import { motion } from "framer-motion";
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
      <h1 className="text-[10rem]">aiko hell yeah 👋🏽</h1>
    </motion.div>
  );
}

export default Hello;
