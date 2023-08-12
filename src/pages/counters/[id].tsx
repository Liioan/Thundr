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
import { type counter } from "~/types/NoteType";
import Main from "~/components/ui/Main";
import DeleteButton from "~/components/ui/buttons/DeleteButton";
import useDebounce from "~/hooks/useDebounce";

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery({ noteId: id as string });
  const utils = api.useContext();

  const [noteContent, setNoteContent] = useState<number>(0);
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

  const handleEdit = () => {
    if (noteContent === note.data?.content && noteTitle === note.data?.title)
      return;
    const stringifiedContent = stringify<counter | undefined>(noteContent);
    editNote.mutate({
      noteId: id as string,
      title: noteTitle,
      content: stringifiedContent,
    });
  };

  const handleClick = (operation: "add" | "subtract") => {
    if (noteContent == undefined) return;
    let newValue = noteContent;
    if (operation === "add") newValue = newValue + 1;
    if (operation === "subtract") newValue = newValue - 1;
    setNoteContent(newValue);
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
        <title>{`Counter - ${note.data?.title}`}</title>
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
          <div className="flex w-full flex-col gap-[25px]">
            <Title
              text={noteTitle ?? note.data.title}
              isDisabled={false}
              onChangeEvent={setNoteTitle}
            />
            <div className="mt-11 flex flex-col gap-[45px] md:mt-20">
              <h2 className="text-center text-5xl text-text-light dark:text-text-dark">
                {noteContent}
              </h2>
              <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
                <button
                  disabled={note.isLoading}
                  className="h-14 w-56 rounded-15 bg-primary-light text-medium font-bold text-text-light disabled:opacity-50 dark:bg-primary-dark"
                  onClick={() => handleClick("add")}
                >
                  Add
                </button>
                <button
                  disabled={note.isLoading}
                  className="h-14 w-56 rounded-15 bg-secondary-light text-medium font-bold text-text-light disabled:opacity-50 dark:bg-secondary-dark"
                  onClick={() => handleClick("subtract")}
                >
                  Subtract
                </button>
              </div>
            </div>
          </div>
          <div className="fixed bottom-[25px] flex items-center gap-5 self-end">
            <DeleteButton id={note.data.id} />
            <div>
              <button
                onClick={() => setNoteContent(0)}
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
