import { useState, useEffect } from "react";
import { type progressTracker } from "~/types/NoteType";

interface ProgressScoreProps {
  content: progressTracker | undefined;
}

const ProgressScore = ({ content }: ProgressScoreProps) => {
  const [daysFinished, setDaysFinished] = useState(0);

  useEffect(() => {
    let daysFinishedCount = 0;

    content?.map((day) => {
      if (day.isFinished) {
        daysFinishedCount++;
      }
    });
    setDaysFinished(daysFinishedCount);
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

export default ProgressScore;
