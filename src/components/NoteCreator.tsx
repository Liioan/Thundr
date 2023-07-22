import { useMultistepForm } from "~/hooks/useMultistepForm";
import Header from "./Header";
import Overlay from "./Overlay";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import Checkbox from "./Checkbox";
import { AnimatePresence, motion } from "framer-motion";
import Title from "./Title";

type noteTypeOptions =
  | "note"
  | "todoList"
  | "progressTracker"
  | "decisionTree"
  | "counter";

interface FormData {
  noteTitle?: string;
  noteType: noteTypeOptions;
  isMarkdown?: boolean;
  daysAmount?: number;
  remindDate?: string;
}

type updateFieldsType = (fields: Partial<FormData>) => void;

type NoteTypeFormProps = noteTypeOptions & {
  noteType: noteTypeOptions;
  updateFields: updateFieldsType;
};

interface FormWrapperProps {
  children: ReactNode;
  className?: string;
}

const FormWrapper = ({ children, className = "" }: FormWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "backInOut", duration: 0.5 }}
      className={`absolute w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

const NoteTypeForm = ({ noteType, updateFields }: NoteTypeFormProps) => {
  const noteTypeList: { value: noteTypeOptions; text: string }[] = [
    { value: "note", text: "Note" },
    { value: "todoList", text: "Todo list" },
    { value: "progressTracker", text: "Progress tracker" },
    { value: "decisionTree", text: "Decision tree" },
    { value: "counter", text: "Counter" },
  ];
  return (
    <FormWrapper className="flex flex-col gap-3">
      <Title text="Select note type" />
      {noteTypeList.map((listItem) => (
        <button
          type="button"
          key={listItem.value}
          className="flex items-center gap-2"
          onClick={() => updateFields({ noteType: listItem.value })}
        >
          <Checkbox toggled={noteType === listItem.value} />
          {listItem.text}
        </button>
      ))}
    </FormWrapper>
  );
};

interface AdditionalInfoFormProps {
  noteTitle?: string;
  noteType: noteTypeOptions;
  isMarkdown?: boolean;
  daysAmount?: number;
  updateFields: updateFieldsType;
}

const AdditionalInfoForm = ({
  noteTitle,
  noteType,
  isMarkdown,
  daysAmount,
  updateFields,
}: AdditionalInfoFormProps) => {
  if (noteType === "note")
    return (
      <FormWrapper className="flex flex-col gap-3">
        <Title text="Select note type" />
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => updateFields({ isMarkdown: false })}
        >
          <Checkbox toggled={!isMarkdown} />
          Normal note
        </button>
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => updateFields({ isMarkdown: true })}
        >
          <Checkbox toggled={isMarkdown ? true : false} />
          Markdown note
        </button>
        <Title text="Note title" />
        <input
          type="text"
          placeholder="E.g.: Project ideas"
          className="h-12 rounded-5 border-2 border-accent-light bg-foreground-light px-2 text-text-light transition-colors duration-200 focus:outline-none focus-visible:border-secondary-light dark:border-accent-dark dark:bg-foreground-dark dark:text-text-dark dark:focus-visible:border-secondary-dark"
          value={noteTitle}
          onChange={(e) => updateFields({ noteTitle: e.target.value })}
        />
      </FormWrapper>
    );

  if (noteType === "progressTracker")
    return (
      <FormWrapper className="flex flex-col gap-3">
        <Title text="Progress tracker title" />
        <input
          type="text"
          placeholder="E.g.: Coding everyday"
          className="h-12 rounded-5 border-2 border-accent-light bg-foreground-light px-2 text-text-light transition-colors duration-200 focus:outline-none focus-visible:border-secondary-light dark:border-accent-dark dark:bg-foreground-dark dark:text-text-dark dark:focus-visible:border-secondary-dark"
          value={noteTitle}
          onChange={(e) => updateFields({ noteTitle: e.target.value })}
        />
        <Title text="Days amount" />
        <input
          type="number"
          placeholder="E.g.: 365"
          className="h-12 rounded-5 border-2 border-accent-light bg-foreground-light px-2 text-text-light transition-colors duration-200 focus:outline-none focus-visible:border-secondary-light dark:border-accent-dark dark:bg-foreground-dark dark:text-text-dark dark:focus-visible:border-secondary-dark"
          value={daysAmount}
          onChange={(e) => updateFields({ daysAmount: Number(e.target.value) })}
        />
      </FormWrapper>
    );

  let otherNoteTitle = "";
  if (noteType === "counter") otherNoteTitle = "Counter";
  if (noteType === "decisionTree") otherNoteTitle = "Decision tree";
  if (noteType === "todoList") otherNoteTitle = "Todo list";

  return (
    <FormWrapper className="flex flex-col gap-3">
      <Title text={otherNoteTitle + " title"} />
      <input
        type="text"
        placeholder="E.g.: Coding everyday"
        className="h-12 rounded-5 border-2 border-accent-light bg-foreground-light px-2 text-text-light transition-colors duration-200 focus:outline-none focus-visible:border-secondary-light dark:border-accent-dark dark:bg-foreground-dark dark:text-text-dark dark:focus-visible:border-secondary-dark"
        value={noteTitle}
        onChange={(e) => updateFields({ noteTitle: e.target.value })}
      />
    </FormWrapper>
  );
};

interface RemindDateFormProps {
  remindDate?: string;
  updateFields: updateFieldsType;
}

const RemindDateForm = ({ remindDate, updateFields }: RemindDateFormProps) => {
  return (
    <FormWrapper className="flex flex-col gap-3">
      <Title text="Remind date (optional)" />
      <input
        type="date"
        className="h-12 w-full rounded-5 border-2 border-accent-light bg-foreground-light px-2 text-text-light transition-colors duration-200 focus:outline-none focus-visible:border-secondary-light dark:border-accent-dark dark:bg-foreground-dark dark:text-text-dark dark:focus-visible:border-secondary-dark"
        value={remindDate}
        onChange={(e) => updateFields({ remindDate: e.target.value })}
      />
    </FormWrapper>
  );
};

const INITIAL_DATA: FormData = {
  noteTitle: "",
  noteType: "note",
  isMarkdown: false,
  daysAmount: 0,
  remindDate: "",
};

const NoteCreator = () => {
  const [data, setData] = useState(INITIAL_DATA);

  const updateFields = (fields: Partial<FormData>) => {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const steps: ReactElement[] = [
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    <NoteTypeForm key={"NoteTypeForm"} {...data} updateFields={updateFields} />,
    <AdditionalInfoForm
      key={"AdditionalInfoForm"}
      {...data}
      updateFields={updateFields}
    />,
    <RemindDateForm
      key={"RemindDateForm"}
      {...data}
      updateFields={updateFields}
    />,
  ];
  const { currentStepIndex, step, isFirstStep, isLastStep, back, next } =
    useMultistepForm(steps);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLastStep) return next();

    console.log("note created", data);
  };

  return (
    <Overlay condition={true} zIndex="10">
      <div className=" flex h-3/4 items-center justify-center">
        <div className="h-[400px] w-[280px] rounded-15 bg-foreground-light p-7 dark:bg-foreground-dark">
          <form
            className="flex h-full w-full flex-col justify-between gap-4 "
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between">
              <Header text="Note creator" />
              <span className="text-medium text-accent-light dark:text-accent-dark">
                {currentStepIndex + 1}/{steps.length}
              </span>
            </div>
            <div className="relative h-full">
              <AnimatePresence>{step}</AnimatePresence>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              <button
                className={` ${
                  isFirstStep ? "opacity-50" : "opacity-100"
                } flex h-8 w-8 items-center justify-center rounded-full bg-primary-light transition-colors duration-200 dark:bg-primary-dark`}
                disabled={isFirstStep}
                onClick={back}
                type="button"
              >
                <ArrowLeftIcon className="w-6 text-text-light dark:text-background-dark" />
              </button>

              <button
                className="min-w-min rounded-full bg-accent-light px-3 text-center text-small font-medium text-text-light dark:bg-accent-dark"
                type="button"
              >
                cancel
              </button>
              <button
                className={`flex h-8 items-center justify-center justify-self-end rounded-full bg-primary-light transition-all duration-200 dark:bg-primary-dark 
                ${isLastStep ? "w-auto px-3" : "w-8"}`}
                type="submit"
              >
                {isLastStep ? (
                  <span className="text-small font-medium text-text-light">
                    finish
                  </span>
                ) : (
                  <ArrowRightIcon className="w-6 text-text-light" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Overlay>
  );
};

export default NoteCreator;
