import { motion } from "framer-motion";

interface HeaderProps {
  text: string;
  animate?: boolean;
}

const Header = ({ text, animate = true }: HeaderProps) => {
  return (
    <motion.h2
      className="text-medium font-bold text-text-light dark:text-text-dark"
      initial={{ opacity: animate ? 1 : 0, y: animate ? -100 : 0 }}
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
