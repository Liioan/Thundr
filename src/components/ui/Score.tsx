interface ScoreProps {
  daysFinished: number;
  daysLeft: number;
}

const Score = ({ daysFinished, daysLeft }: ScoreProps) => {
  return (
    <div className="text-medium font-bold">
      score
      <span className="text-accent-light dark:text-accent-dark">:</span>{" "}
      <span className="text-accept-light dark:text-accept-dark">
        {daysFinished}
      </span>{" "}
      /{" "}
      <span className="text-accent-light dark:text-accent-dark">
        {daysLeft}
      </span>
    </div>
  );
};

export default Score;
