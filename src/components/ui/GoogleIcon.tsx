interface GoogleIconProps {
  iconName: string;
  className?: string;
}

const GoogleIcon = ({ iconName, className = "" }: GoogleIconProps) => {
  return (
    <span className={`material-symbols-outlined ${className}`}>{iconName}</span>
  );
};

export default GoogleIcon;
