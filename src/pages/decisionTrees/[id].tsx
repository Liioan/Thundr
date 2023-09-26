import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoBackButton from "~/components/ui/buttons/GoBackButton";
import Title from "~/components/ui/Title";
import { api } from "~/utils/api";
import PinSwitch from "~/components/ui/PinSwitch";
import LoadingScreen from "~/components/global/LoadingScreen";
import { ResponsiveWrapper } from "~/components/ui/layout/ResponsiveWrapper";
import { stringify } from "~/utils/JsonUtils";
import { type decisionTree } from "~/types/NoteType";
import Main from "~/components/ui/layout/Main";
import DeleteButton from "~/components/ui/buttons/DeleteButton";
import { IoMdAdd } from "react-icons/io";
import useDebounce from "~/hooks/useDebounce";
import DecisionTreeItem from "~/components/ui/DecisionTreeItem";
import Header from "~/components/ui/Header";
import DecisionScore from "~/components/ui/scores/DecisionScore";
import ReminderDate from "~/components/ui/ReminderDate";

interface AddNewTodoProps {
  onClickEvent: () => void;
}

const AddNewItem = ({ onClickEvent }: AddNewTodoProps) => {
  return (
    <button
      className="flex items-center justify-center gap-[10px] self-start"
      onClick={onClickEvent}
    >
      <IoMdAdd className="text-2xl text-accent-light dark:text-accent-dark" />{" "}
      Add new item
    </button>
  );
};

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery(
    { noteId: id as string },
    { refetchOnMount: true }
  );
  const utils = api.useContext();

  const [noteContent, setNoteContent] = useState<decisionTree | undefined>();
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [isNotePinned, setIsNotePinned] = useState<boolean>(false);
  const [noteReminderDate, setNoteReminderDate] = useState<string | null>(null);

  const editNote = api.note.editNote.useMutation({
    async onSuccess(input) {
      await utils.note.getNoteDetails.invalidate({ noteId: input.id });
    },
  });

  const togglePin = api.note.togglePin.useMutation({
    async onSuccess() {
      await utils.note.getNoteDetails.fetch({ noteId: note.data?.id ?? "" });
    },
  });

  const handleTogglePin = () => {
    if (isNotePinned === note.data?.pinnedByMe) return;
    togglePin.mutate({ noteId: note.data?.id ?? "" });
  };

  const addArgument = (isPositive: boolean) => {
    let hasEmptyArgument = false;
    noteContent?.forEach((argument) => {
      if (!argument.text.length && argument.isPositive === isPositive) {
        hasEmptyArgument = true;
        return;
      }
    });
    if (hasEmptyArgument) return;
    const newArgument = { text: "", isPositive: isPositive };
    setNoteContent((prev) => [...(prev ?? []), newArgument]);
  };

  const changeArgumentText = (text: string, argumentId: number) => {
    const newArgumentsArray = noteContent?.map((argument, i) => {
      if (i === argumentId) {
        return { ...argument, text: text };
      } else return argument;
    });
    setNoteContent(newArgumentsArray);
  };

  const removeArgument = (taskId: number) => {
    const newArgumentsArray = noteContent?.filter((task, i) => {
      if (i !== taskId) return task;
    });
    setNoteContent(newArgumentsArray);
  };

  const handleEdit = () => {
    if (
      noteContent === note.data?.content &&
      noteTitle === note.data?.title &&
      noteReminderDate === note.data?.reminderDate
    )
      return;
    const stringifiedContent = stringify<decisionTree | undefined>(noteContent);
    editNote.mutate({
      noteId: id as string,
      title: noteTitle,
      content: stringifiedContent,
      reminderDate: noteReminderDate,
    });
  };

  useDebounce(handleEdit, 750, [noteContent, noteTitle, noteReminderDate]);
  useDebounce(handleTogglePin, 500, [isNotePinned]);

  useEffect(() => {
    if (note.data != null) {
      setNoteContent(note.data.content);
      setIsNotePinned(note.data.pinnedByMe);
      setNoteTitle(note.data.title);
      setNoteReminderDate(note.data.reminderDate);
    }
  }, [note.data]);

  if (note.isLoading) return <LoadingScreen />;

  if (note.data == null) return null;

  return (
    <>
      <Head>
        <title>{`Todo list - ${note.data?.title}`}</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        <ResponsiveWrapper>
          <div className="flex items-center justify-between">
            <GoBackButton />
            <div className="flex h-10 w-10 items-center justify-center">
              <PinSwitch
                toggled={isNotePinned ?? note.data.pinnedByMe}
                onClickEvent={() => setIsNotePinned((prev) => !prev)}
              />
            </div>
          </div>
          <form
            className="flex w-full flex-col gap-[25px]"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Title
              text={noteTitle ?? note.data.title}
              isDisabled={false}
              onChangeEvent={setNoteTitle}
            />
            <ReminderDate
              noteReminderDate={noteReminderDate}
              setNoteReminderDate={setNoteReminderDate}
            />
            <DecisionScore content={noteContent} />
            <div className={`flex flex-col gap-[50px]`}>
              <ul className="relative flex flex-col gap-[15px] after:absolute after:-bottom-[25px] after:h-1 after:w-full after:rounded-15 after:bg-foreground-light after:content-[''] dark:after:bg-foreground-dark">
                <Header text="for" />
                {noteContent?.map((argument, i) => {
                  if (argument.isPositive)
                    return (
                      <DecisionTreeItem
                        key={i}
                        argumentId={i}
                        text={argument.text}
                        isPositive={argument.isPositive}
                        changeArgumentText={changeArgumentText}
                        removeArgument={removeArgument}
                      />
                    );
                })}
                <AddNewItem onClickEvent={() => addArgument(true)} />
              </ul>
              <ul className="flex flex-col gap-[15px]">
                <Header text="against" />
                {noteContent?.map((argument, i) => {
                  if (!argument.isPositive)
                    return (
                      <DecisionTreeItem
                        key={i}
                        argumentId={i}
                        text={argument.text}
                        isPositive={argument.isPositive}
                        changeArgumentText={changeArgumentText}
                        removeArgument={removeArgument}
                      />
                    );
                })}
                <AddNewItem onClickEvent={() => addArgument(false)} />
              </ul>
            </div>
          </form>
          <div className="fixed bottom-[25px] flex items-center gap-5 self-end">
            <DeleteButton id={note.data.id} />
            <div>{/* button */}</div>
          </div>
        </ResponsiveWrapper>
      </Main>
    </>
  );
};

export default NotePage;
