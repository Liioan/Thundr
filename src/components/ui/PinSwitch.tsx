import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import { BookmarkIcon as BookmarkOutlineIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";

interface PinSwitchProps {
  toggled: boolean;
}

const PinSwitch = ({ toggled }: PinSwitchProps) => {
  return (
    <div className="relative z-10 flex items-center justify-center">
      <AnimatePresence>
        {toggled && (
          <motion.span
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BookmarkSolidIcon className=" right-0 h-6 text-primary-light dark:text-primary-dark" />
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!toggled && (
          <motion.span
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BookmarkOutlineIcon className=" right-0 h-6 text-secondary-light dark:text-secondary-dark" />
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PinSwitch;
