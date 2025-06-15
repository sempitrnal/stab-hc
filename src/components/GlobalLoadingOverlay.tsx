// components/GlobalLoadingOverlay.tsx
import useGlobalLoadingStore from "@/stores/loading";
import { AnimatePresence, motion } from "framer-motion";

const GlobalLoadingOverlay = () => {
  const loading = useGlobalLoadingStore((s) => s.loading);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-6 h-6 border-2 border-black rounded-full border-t-transparent animate-spin"></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoadingOverlay;
