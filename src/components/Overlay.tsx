import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";

interface OverlayProps {
  children: ReactNode;
  condition: boolean;
  zIndex: string;
}

const Overlay = ({ children, condition, zIndex = "z-10" }: OverlayProps) => {
  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          className={`${zIndex} fixed flex h-screen w-screen flex-col bg-background-light-opacity px-[25px] pt-24 backdrop-blur-sm transition-colors duration-200 dark:bg-background-dark-opacity lg:max-w-sm`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
