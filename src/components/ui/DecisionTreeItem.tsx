import { useState } from "react";
import XButton from "./buttons/XButton";
import { motion } from "framer-motion";
import useDebounce from "~/hooks/useDebounce";
import TextArea from "./TextArea";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

interface IsPositiveIconProps {
  isPositive: boolean;
}

const IsPositiveIcon = ({ isPositive }: IsPositiveIconProps) => {
  return (
    <span
      className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors duration-200 ${
        isPositive
          ? "bg-accept-light dark:bg-accept-dark"
          : "bg-accent-light dark:bg-accent-dark"
      }`}
    >
      {isPositive ? (
        <span className="flex items-center justify-center">
          <IoMdCheckmark className="text-xl text-text-light" />
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <IoMdClose className="text-xl text-text-light" />
        </span>
      )}
    </span>
  );
};

interface DecisionTreeItemProps {
  text: string;
  isPositive: boolean;
  argumentId: number;
  disabled?: boolean;
  onClickEvent?: (argumentId: number) => void;
  changeArgumentText?: (text: string, argumentId: number) => void;
  removeArgument?: (argumentId: number) => void;
}

const DecisionTreeItem = ({
  text,
  isPositive,
  onClickEvent,
  argumentId,
  changeArgumentText,
  removeArgument,
  disabled = false,
}: DecisionTreeItemProps) => {
  const [argumentText, setArgumentText] = useState<string>(text);

  const handleEdit = () => {
    if (!changeArgumentText) return;
    changeArgumentText(argumentText ?? "", argumentId);
  };

  useDebounce<string>(handleEdit, 500, [argumentText]);

  const handleClick = () => {
    if (!onClickEvent) return;
    onClickEvent(argumentId);
  };

  const handleRemove = () => {
    if (!removeArgument) return;
    removeArgument(argumentId);
  };

  return (
    <motion.li
      className="flex items-center justify-between"
      initial={{ opacity: disabled ? 1 : 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex w-full items-center gap-[10px]">
        <button onClick={handleClick}>
          <IsPositiveIcon isPositive={isPositive} />
        </button>
        <TextArea
          className={`w-full resize-none bg-transparent text-text-light focus:text-primary-light focus:outline-none dark:text-text-dark dark:focus:text-primary-dark`}
          text={argumentText}
          isDisabled={disabled}
          maxLength={200}
          placeholder={disabled ? "empty argument" : "type in your argument"}
          onChangeEvent={setArgumentText}
        />
      </div>
      <div>{!disabled && <XButton onClickEvent={handleRemove} />}</div>
    </motion.li>
  );
};

export default DecisionTreeItem;
