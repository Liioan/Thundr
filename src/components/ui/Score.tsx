import { useState, useEffect } from "react";
import { type progressTracker } from "~/types/NoteType";

interface ScoreProps {
  content: progressTracker | undefined;
}

const Score = ({ content }: ScoreProps) => {
  const [daysFinished, setDaysFinished] = useState(0);

  useEffect(() => {
    let daysFinished = 0;

    content?.map((day) => {
      if (day.isFinished) {
        daysFinished++;
      }
    });
    setDaysFinished(daysFinished);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <div className="text-medium font-bold">
      score
      <span className="text-accent-light dark:text-accent-dark">:</span>{" "}
      <span className="text-accept-light dark:text-accept-dark">
        {daysFinished}
      </span>{" "}
      /{" "}
      <span className="text-accent-light dark:text-accent-dark">
        {content?.length}
      </span>
    </div>
  );
};

export default Score;
