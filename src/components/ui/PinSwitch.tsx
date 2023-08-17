import { AnimatePresence, motion } from "framer-motion";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";

interface PinSwitchProps {
  toggled: boolean;
  onClickEvent?: () => void;
}

const PinSwitch = ({ toggled, onClickEvent }: PinSwitchProps) => {
  const handleClick = () => {
    if (!onClickEvent) return;

    onClickEvent();
  };

  return (
    <button
      className="relative z-10 flex items-center justify-center"
      onClick={handleClick}
    >
      <AnimatePresence>
        {toggled && (
          <motion.span
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <GoBookmarkFill className="text-2xl font-light text-primary-light dark:text-primary-dark" />
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
            transition={{ duration: 0.1 }}
          >
            <GoBookmark className="text-2xl font-light text-secondary-light dark:text-secondary-dark" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default PinSwitch;
