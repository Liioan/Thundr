import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoBackButton from "~/components/ui/buttons/GoBackButton";
import Title from "~/components/ui/Title";
import { api } from "~/utils/api";
import PinSwitch from "~/components/ui/PinSwitch";
import LoadingScreen from "~/components/global/LoadingScreen";
import { ResponsiveWrapper } from "~/components/ui/ResponsiveWrapper";
import { stringify } from "~/utils/JsonUtils";
import { type progressTracker } from "~/types/NoteType";
import Main from "~/components/ui/Main";
import DeleteButton from "~/components/ui/buttons/DeleteButton";
import useDebounce from "~/hooks/useDebounce";
import ProgressTile from "~/components/ui/ProgressTile";
import Score from "~/components/ui/Score";

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery(
    { noteId: id as string },
    { refetchOnMount: true }
  );
  const utils = api.useContext();

  const [noteContent, setNoteContent] = useState<progressTracker | undefined>();
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [isNotePinned, setIsNotePinned] = useState<boolean>(false);

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
    togglePin.mutate({ noteId: note.data?.id ?? "" });
  };

  const changeDayStatus = (dayId: number) => {
    if (noteContent == null) return;
    const newDaysArray = noteContent.map((day, i) => {
      if (i === dayId) {
        return { ...day, isFinished: !day.isFinished };
      } else return day;
    });
    setNoteContent(newDaysArray);
  };

  const resetProgress = () => {
    const newDaysArray = noteContent?.map((day) => {
      return { ...day, isFinished: false };
    });
    setNoteContent(newDaysArray);
  };

  const handleEdit = () => {
    if (noteContent === note.data?.content && noteTitle === note.data?.title)
      return;
    const stringifiedContent = stringify<progressTracker | undefined>(
      noteContent
    );
    editNote.mutate({
      noteId: id as string,
      title: noteTitle,
      content: stringifiedContent,
    });
  };

  useDebounce(handleEdit, 500, [noteContent, noteTitle]);

  useEffect(() => {
    if (note.data != null) {
      setNoteContent(note.data.content);
      setIsNotePinned(note.data.pinnedByMe);
      setNoteTitle(note.data.title);
    }
  }, [note.data]);

  if (note.isLoading) return <LoadingScreen />;

  if (note.data == null) return null;

  return (
    <>
      <Head>
        <title>{`Progress tracker - ${note.data?.title}`}</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        <ResponsiveWrapper>
          <div className="flex items-center justify-between">
            <GoBackButton />
            <div className="flex h-10 w-10 items-center justify-center">
              <PinSwitch
                toggled={isNotePinned ?? note.data.pinnedByMe}
                onClickEvent={handleTogglePin}
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
            <Score content={noteContent} />
            <ul className="relative mt-4 grid grid-cols-4 gap-2 self-center sm:grid-cols-6 lg:grid-cols-9">
              {noteContent?.map((day, i) => (
                <ProgressTile
                  key={i}
                  dayNumber={day.dayNumber}
                  isFinished={day.isFinished}
                  onClickEvent={() => changeDayStatus(i)}
                />
              ))}
            </ul>
          </form>
          <div className="fixed bottom-[25px] flex items-center gap-2 self-end">
            <DeleteButton id={note.data.id} />
            <div>
              <button
                onClick={resetProgress}
                className="flex h-8 w-24 items-center justify-center gap-2 rounded-full bg-accent-light text-small font-bold text-text-light dark:bg-accent-dark"
              >
                reset
              </button>
              {/* button */}
            </div>
          </div>
        </ResponsiveWrapper>
      </Main>
    </>
  );
};

export default NotePage;
