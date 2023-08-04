import { useState } from "react";
import Checkbox from "./Checkbox";
import XButton from "./buttons/XButton";
import { motion } from "framer-motion";

interface TodoItemProps {
  task: string;
  isFinished: boolean;
  taskId: number;
  disabled?: boolean;
  onClickEvent?: (taskId: number) => void;
  changeTaskText?: (text: string, taskId: number) => void;
  removeTask?: (taskId: number) => void;
}

const TodoItem = ({
  task,
  isFinished = false,
  onClickEvent,
  taskId,
  changeTaskText,
  removeTask,
  disabled = false,
}: TodoItemProps) => {
  const [taskText, setTaskText] = useState<string>(task);

  const handleBlur = () => {
    if (!changeTaskText) return;
    changeTaskText(taskText ?? "", taskId);
  };

  const handleClick = () => {
    if (!onClickEvent) return;
    onClickEvent(taskId);
  };

  const handleRemove = () => {
    if (!removeTask) return;
    removeTask(taskId);
  };

  const handleChange = (newTaskText: string) => {
    newTaskText.trim();
    setTaskText(newTaskText);
  };

  return (
    <motion.li
      className="flex items-center justify-between"
      initial={{ opacity: disabled ? 1 : 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-[10px]">
        <button onClick={handleClick}>
          <Checkbox toggled={isFinished} />
        </button>
        <input
          className={`resize-none bg-transparent text-text-light focus:text-primary-light focus:outline-none dark:text-text-dark dark:focus:text-primary-dark ${
            isFinished ? "line-through opacity-50" : "opacity-100"
          }`}
          value={taskText}
          disabled={isFinished || disabled}
          maxLength={200}
          placeholder={disabled ? "empty task" : "type in your task"}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <div className={isFinished ? "opacity-100" : "opacity-50"}>
        {!disabled && <XButton onClickEvent={handleRemove} />}
      </div>
    </motion.li>
  );
};

export default TodoItem;
