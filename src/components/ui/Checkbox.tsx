import { AnimatePresence, motion } from "framer-motion";
import { IoMdCheckmark } from "react-icons/io";

interface CheckboxProps {
  toggled: boolean;
}

const Checkbox = ({ toggled }: CheckboxProps) => {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${
        toggled
          ? "border-accept-light bg-accept-light dark:border-accept-dark dark:bg-accept-dark"
          : "border-2 border-primary-light hover:border-accept-light dark:border-primary-dark dark:hover:border-accept-dark"
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
            <IoMdCheckmark className="text-xl text-text-light" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default Checkbox;
