import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoBackButton from "~/components/ui/buttons/GoBackButton";
import Title from "~/components/ui/Title";
import { api } from "~/utils/api";
import PinSwitch from "~/components/ui/PinSwitch";
import LoadingScreen from "~/components/global/LoadingScreen";
import TextArea from "~/components/ui/TextArea";
import { ResponsiveWrapper } from "~/components/ui/layout/ResponsiveWrapper";
import { stringify } from "~/utils/JsonUtils";
import { type note } from "~/types/NoteType";
import Main from "~/components/ui/layout/Main";
import DeleteButton from "~/components/ui/buttons/DeleteButton";
import useDebounce from "~/hooks/useDebounce";
import ReminderDate from "~/components/ui/ReminderDate";

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery({ noteId: id as string });
  const utils = api.useContext();

  const [noteContent, setNoteContent] = useState<string>("");
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

  const handleEdit = () => {
    if (
      noteContent === note.data?.content &&
      noteTitle === note.data?.title &&
      noteReminderDate === note.data?.reminderDate
    )
      return;
    const stringifiedContent = stringify<note | undefined>(noteContent);
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
        <title>{`Note - ${note.data?.title}`}</title>
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
              handleEdit();
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
            <TextArea
              className="h-auto resize-none bg-background-light text-small text-text-light caret-primary-light focus:outline-none dark:bg-background-dark dark:text-text-dark dark:caret-primary-dark"
              placeholder="type something here"
              text={noteContent ?? note.data.content}
              onChangeEvent={setNoteContent}
              isDisabled={false}
              maxLength={3000}
            />
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
