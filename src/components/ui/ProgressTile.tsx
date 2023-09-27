interface ProgressTileProps {
  dayNumber: number;
  isFinished: boolean;
  onClickEvent?: () => void;
  disabled?: boolean;
  showcase?: boolean;
}

const ProgressTile = ({
  dayNumber,
  isFinished,
  onClickEvent,
  disabled = false,
  showcase = false,
}: ProgressTileProps) => {
  const handleClick = () => {
    if (onClickEvent) {
      onClickEvent();
    }
  };

  return (
    <li className={`aspect-square ${showcase ? "w-[50px]" : "w-[70px]"}`}>
      <button
        className={`h-full w-full rounded-15 text-3xl transition-colors duration-200 ${
          isFinished
            ? "bg-accept-light text-text-light transition-colors duration-200 hover:bg-accent-light dark:bg-accept-dark dark:hover:bg-accent-dark"
            : "border-2 border-accent-light text-text-light hover:border-accept-dark dark:border-accent-dark dark:text-text-dark dark:hover:border-accept-dark"
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
