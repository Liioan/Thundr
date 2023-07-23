import { useMultistepForm } from "~/hooks/useMultistepForm";
import Header from "../ui/Header";
import Overlay from "../ui/Overlay";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import Checkbox from "../ui/Checkbox";
import { AnimatePresence, motion } from "framer-motion";
import Title from "../ui/Title";
import { useUiStore } from "~/store/useUiStore";
import { api } from "~/utils/api";
import Router from "next/router";

interface FormData {
  noteTitle?: string;
  noteType: string;
  isMarkdown?: boolean;
  daysAmount?: number;
  reminderDate?: string;
}

type updateFieldsType = (fields: Partial<FormData>) => void;

interface NoteTypeFormProps {
  noteType: string;
  updateFields: updateFieldsType;
}

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
  const noteTypeList: { value: string; text: string }[] = [
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
  noteType: string;
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
  const makeDate = (date: Date) => {
    const fullDate = date.toISOString().split("T")[0];
    updateFields({ reminderDate: fullDate });
  };

  return (
    <FormWrapper className="flex flex-col gap-3">
      <Title text="Remind date (optional)" />
      <input
        type="date"
        className="h-12 w-full rounded-5 border-2 border-accent-light bg-foreground-light px-2 text-text-light transition-colors duration-200 focus:outline-none focus-visible:border-secondary-light dark:border-accent-dark dark:bg-foreground-dark dark:text-text-dark dark:focus-visible:border-secondary-dark"
        value={void remindDate?.toString}
        onChange={(e) => makeDate(new Date(e.target.value))}
      />
    </FormWrapper>
  );
};

const INITIAL_DATA: FormData = {
  noteTitle: "",
  noteType: "note",
  isMarkdown: false,
  daysAmount: 0,
  reminderDate: undefined,
};

const NoteCreator = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const { isNoteCreatorOpen, setIsNoteCreatorOpen } = useUiStore();

  const updateFields = (fields: Partial<FormData>) => {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  };

  const steps: ReactElement[] = [
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

  const { currentStepIndex, step, isFirstStep, isLastStep, back, next, goTo } =
    useMultistepForm(steps);

  const createNote = api.note.createNote.useMutation({
    onSuccess: async (newNote) => {
      setIsNoteCreatorOpen();
      await Router.push(`/notes/${newNote?.id}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isLastStep) return next();
    createNote.mutate({ ...data });
  };

  return (
    <Overlay condition={isNoteCreatorOpen} zIndex="z-10">
      <div className=" flex h-3/4 items-center justify-center transition-colors duration-200">
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
                onClick={() => {
                  setIsNoteCreatorOpen();
                  setData(INITIAL_DATA);
                  goTo(0);
                }}
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

export const OpenNoteCreatorButton = () => {
  const { setIsNoteCreatorOpen } = useUiStore();

  return (
    <button
      className="fixed bottom-[25px] right-[25px] z-0 flex h-auto w-auto items-center justify-center gap-2 rounded-full bg-accept-light px-3 text-medium text-text-light dark:bg-accept-dark"
      onClick={setIsNoteCreatorOpen}
    >
      <PencilSquareIcon className="w-5 text-text-light" />
      new
    </button>
  );
};