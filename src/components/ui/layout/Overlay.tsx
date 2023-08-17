import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";

interface OverlayProps {
  children: ReactNode;
  condition: boolean;
  zIndex: string;
  className?: string;
}

const Overlay = ({
  children,
  condition,
  zIndex = "z-10",
  className = "",
}: OverlayProps) => {
  return (
    <AnimatePresence>
      {condition && (
        <motion.div
          className={`${zIndex} ${className} fixed flex h-screen w-screen flex-col bg-background-light-opacity px-[25px] pt-24 backdrop-blur-sm transition-colors duration-200 dark:bg-background-dark-opacity  `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
