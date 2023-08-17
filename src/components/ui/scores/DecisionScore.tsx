import { useState, useEffect } from "react";
import type { decisionTree } from "~/types/NoteType";

interface DecisionScoreProps {
  content: decisionTree | undefined;
}

const DecisionScore = ({ content }: DecisionScoreProps) => {
  const [positiveArguments, setPositiveArguments] = useState(0);
  const [negativeArguments, setNegativeArguments] = useState(0);

  useEffect(() => {
    let positiveArgumentsCount = 0;
    let negativeArgumentsCount = 0;

    content?.map((argument) => {
      if (argument.isPositive) {
        positiveArgumentsCount++;
      } else {
        negativeArgumentsCount++;
      }
    });
    setPositiveArguments(positiveArgumentsCount);
    setNegativeArguments(negativeArgumentsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <div className="text-medium font-bold">
      score
      <span className="text-accent-light dark:text-accent-dark">:</span>{" "}
      <span className="text-accept-light dark:text-accept-dark">
        {positiveArguments}
      </span>{" "}
      /{" "}
      <span className="text-accent-light dark:text-accent-dark">
        {negativeArguments}
      </span>
    </div>
  );
};

export default DecisionScore;
