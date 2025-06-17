import { motion } from "framer-motion";
import { useRouter } from "next/router";

const DefaultTemplate = ({
  children,
  head,
}: {
  children: React.ReactNode;
  head?: React.ReactNode;
}) => {
  const router = useRouter();
  return (
    <motion.div
      className="w-full min-h-screen bg-[#b900d5] text-black "
      // style={{
      //   backgroundImage: "url('/old-cement-wall-texture.jpg')",
      //   backgroundSize: "cover",
      //   backgroundRepeat: "repeat",
      //   backgroundBlendMode: "overlay",
      // }}
    >
      {head}
      {children}
    </motion.div>
  );
};

export default DefaultTemplate;
