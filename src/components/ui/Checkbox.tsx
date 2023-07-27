import { AnimatePresence, motion } from "framer-motion";
import Icon from "../global/Icon";

interface CheckboxProps {
  toggled: boolean;
}

const Checkbox = ({ toggled }: CheckboxProps) => {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${
        toggled
          ? "border-accept-light bg-accept-light dark:border-accept-dark dark:bg-accept-dark"
          : "border-2 border-primary-light dark:border-primary-dark"
      }`}
    >
      <AnimatePresence>
        {toggled && (
          <motion.span
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: "backInOut", duration: 0.2 }}
          >
            {/* <CheckIcon className="w-5 -translate-x-[1px] text-text-light" /> */}
            <Icon
              iconName="done"
              className=" -translate-x-[1px] text-text-light"
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Checkbox;
