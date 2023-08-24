import { useHotkeys } from "@mantine/hooks";
import { useMultistepForm } from "~/hooks/useMultistepForm";
import Header from "../ui/Header";
import Overlay from "../ui/layout/Overlay";
import {
  type FormEvent,
  type ReactElement,
  type ReactNode,
  useState,
} from "react";
import Checkbox from "../ui/Checkbox";
import { AnimatePresence, motion } from "framer-motion";
import Title from "../ui/Title";
import { useUiStore } from "~/store/useUiStore";
import { api } from "~/utils/api";
import Router from "next/router";
import { IoIosArrowBack, IoIosArrowForward, IoMdAdd } from "react-icons/io";
import usePopup from "~/hooks/usePopup";

interface FormData {
  noteTitle?: string;
  noteType: string;
  daysAmount: number;
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
    { value: "counter", text: "Counter" },
    { value: "progressTracker", text: "Progress tracker" },
    { value: "decisionTree", text: "Decision tree" },
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
  daysAmount,
  updateFields,
}: AdditionalInfoFormProps) => {
  if (noteType === "note" || noteType === "markdownNote")
    return (
      <FormWrapper className="flex flex-col gap-3">
        <Title text="Select note type" />
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => updateFields({ noteType: "note" })}
        >
          <Checkbox toggled={noteType === "note"} />
          Normal note
        </button>
        <button
          type="button"
          className="flex items-center gap-2"
          onClick={() => updateFields({ noteType: "markdownNote" })}
        >
          <Checkbox toggled={noteType === "markdownNote"} />
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
  let placeholderText = "";
  if (noteType === "counter") {
    otherNoteTitle = "Counter";
    placeholderText = "E.g.: Books I read";
  }
  if (noteType === "decisionTree") {
    otherNoteTitle = "Decision tree";
    placeholderText = "E.g.: Buying new laptop";
  }
  if (noteType === "todoList") {
    otherNoteTitle = "Todo list";
    placeholderText = "E.g.: Shopping list";
  }

  return (
    <FormWrapper className="flex flex-col gap-3">
      <Title text={otherNoteTitle + " title"} />
      <input
        type="text"
        placeholder={placeholderText}
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
    updateFields({ reminderDate: date.toLocaleDateString() });
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
  daysAmount: 0,
  reminderDate: undefined,
};

const NoteCreator = () => {
  const [data, setData] = useState(INITIAL_DATA);
  const { isNoteCreatorOpen, setIsNoteCreatorOpen } = useUiStore();
  const { openPopup } = usePopup();

  const updateFields = (fields: Partial<FormData>) => {
    setData((prev) => {
      return { ...prev, ...fields };
    });
  };

  useHotkeys([["escape", () => setIsNoteCreatorOpen(false)]]);

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
      setIsNoteCreatorOpen(false);
      setData(INITIAL_DATA);
      goTo(0);
      await Router.push(`/${newNote?.noteType}s/${newNote?.id}`);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentStepIndex === 1) {
      if (data.noteType === "progressTracker" && data.daysAmount < 1)
        return openPopup("incorrect days amount ", true);
    }
    if (!isLastStep) return next();
    createNote.mutate({ ...data });
  };

  return (
    <Overlay condition={isNoteCreatorOpen} zIndex="z-20">
      <div className="flex h-3/4 items-center justify-center transition-colors duration-200">
        <div className="h-[400px] w-[280px] rounded-15 bg-foreground-light p-7 dark:bg-foreground-dark">
          <motion.form
            className="flex h-full w-full flex-col justify-between gap-4 "
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
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
                  isFirstStep
                    ? "opacity-50"
                    : "opacity-100 hover:bg-accept-light dark:hover:bg-accept-dark"
                } flex h-8 w-8 items-center justify-center rounded-full bg-primary-light transition-colors duration-200  dark:bg-primary-dark `}
                disabled={isFirstStep}
                onClick={back}
                type="button"
              >
                <IoIosArrowBack className="-translate-x-[1px] text-2xl text-text-light" />
              </button>

              <button
                className="min-w-min rounded-full bg-accent-light px-3 text-center text-small font-medium text-text-light transition-colors duration-200 hover:bg-danger-light dark:bg-accent-dark dark:hover:bg-danger-dark"
                type="button"
                onClick={() => {
                  setIsNoteCreatorOpen(false);
                  setData(INITIAL_DATA);
                  goTo(0);
                }}
              >
                cancel
              </button>
              <button
                className={`flex h-8 items-center justify-center justify-self-end rounded-full bg-primary-light transition-all duration-200 hover:bg-accept-light disabled:opacity-50 dark:bg-primary-dark dark:hover:bg-accept-dark
                ${isLastStep ? "w-auto px-3" : "w-8"}`}
                type="submit"
                disabled={createNote.isLoading}
              >
                {isLastStep ? (
                  <span className="text-small font-medium text-text-light">
                    finish
                  </span>
                ) : (
                  <IoIosArrowForward className="translate-x-[1px] text-2xl text-text-light" />
                )}
              </button>
            </div>
          </motion.form>
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
      className="fixed bottom-[25px] right-[25px] z-10 flex h-auto w-auto items-center justify-center gap-2 rounded-full bg-accept-light px-3 text-medium text-text-light transition-colors duration-200 hover:bg-primary-light dark:bg-accept-dark dark:hover:bg-primary-dark"
      onClick={() => setIsNoteCreatorOpen(true)}
    >
      <IoMdAdd className="text-2xl text-text-light" />
      new
    </button>
  );
};
