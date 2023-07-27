interface GoogleIconProps {
  iconName: string;
  className?: string;
}

const Icon = ({ iconName, className = "" }: GoogleIconProps) => {
  return (
    <span className={`material-symbols-rounded ${className}`}>{iconName}</span>
  );
};

export default Icon;
