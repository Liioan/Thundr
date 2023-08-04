import { motion } from "framer-motion";

interface HeaderProps {
  text: string;
}

const Header = ({ text }: HeaderProps) => {
  return (
    <motion.h2
      className="text-medium font-bold text-text-light dark:text-text-dark"
      initial={{ opacity: 0, y: -100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "backInOut" }}
    >
      {text}
      <span className="text-accent-light dark:text-accent-dark">:</span>
    </motion.h2>
  );
};

export default Header;
