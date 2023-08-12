interface ProgressTileProps {
  dayNumber: number;
  isFinished: boolean;
  onClickEvent?: () => void;
  disabled?: boolean;
}

const ProgressTile = ({
  dayNumber,
  isFinished,
  onClickEvent,
  disabled = false,
}: ProgressTileProps) => {
  const handleClick = () => {
    if (onClickEvent) {
      onClickEvent();
    }
  };

  return (
    <li className="h-[70px] w-[70px]">
      <button
        className={`h-full w-full rounded-15 text-3xl transition-colors duration-200 ${
          isFinished
            ? "bg-accept-light text-text-light dark:bg-accept-dark "
            : "border-2 border-accent-light text-text-light dark:border-accent-dark dark:text-text-dark"
        }`}
        disabled={disabled}
        onClick={handleClick}
      >
        {dayNumber}
      </button>
    </li>
  );
};

export default ProgressTile;
