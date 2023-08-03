import { AnimatePresence, motion } from "framer-motion";
import Icon from "../global/Icon";

interface PinSwitchProps {
  toggled: boolean;
  onClickEvent: () => void;
}

const PinSwitch = ({ toggled, onClickEvent }: PinSwitchProps) => {
  return (
    <button
      className="relative z-10 flex items-center justify-center"
      onClick={onClickEvent}
    >
      <AnimatePresence>
        {toggled && (
          <motion.span
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              iconName="bookmark"
              className="filled text-3xl font-light text-primary-light dark:text-primary-dark"
            />
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
            <Icon
              iconName="bookmark"
              className="text-3xl font-light text-secondary-light dark:text-secondary-dark"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default PinSwitch;
