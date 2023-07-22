interface HeaderProps {
  text: string;
}

const Header = ({ text }: HeaderProps) => {
  return (
    <h2 className="text-medium text-text-light dark:text-text-dark">
      {text}
      <span className="text-accent-light dark:text-accent-dark">:</span>
    </h2>
  );
};

export default Header;
