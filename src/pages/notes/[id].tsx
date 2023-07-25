import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoBackButton from "~/components/global/GoBackButton";
import Title from "~/components/ui/Title";
import { api } from "~/utils/api";
import PinSwitch from "~/components/ui/PinSwitch";
import LoadingScreen from "~/components/global/LoadingScreen";
import TextArea from "~/components/ui/TextArea";

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery({ noteId: id as string });
  const utils = api.useContext();

  const [noteContent, setNoteContent] = useState<string | undefined>();
  const [noteTitle, setNoteTitle] = useState<string | undefined>();
  const [isNotePinned, setIsNotePinned] = useState<boolean | undefined>();

  const editNote = api.note.editNote.useMutation({
    async onSuccess(input) {
      await utils.note.getNoteDetails.fetch({ noteId: input.id });
    },
  });

  const handleEdit = () => {
    if (noteContent === note.data?.content && noteTitle === note.data?.title)
      return;
    editNote.mutate({
      noteId: id as string,
      title: noteTitle,
      content: noteContent,
      pinned: isNotePinned,
    });
  };

  useEffect(() => {
    handleEdit();
  }, [isNotePinned]);

  useEffect(() => {
    setNoteContent(note.data?.content);
    setNoteTitle(note.data?.title);
    setIsNotePinned(note.data?.pinned);
  }, [note.data]);

  if (note.isLoading) return <LoadingScreen fullscreen />;

  if (note.data == null) return null;

  return (
    <>
      <Head>
        <title>{`Note - ${note.data?.title}`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="flex h-screen flex-col gap-[25px] bg-background-light px-[25px] pt-24 transition-colors duration-200 dark:bg-background-dark">
        <div className="flex items-center justify-between">
          <GoBackButton />
          <button
            className="flex h-10 w-10 items-center justify-center"
            onClick={() => {
              setIsNotePinned((prev) => !prev);
            }}
          >
            <PinSwitch toggled={isNotePinned ?? note.data.pinned} />
          </button>
        </div>
        <form
          className="flex flex-col gap-[25px]"
          onSubmit={(e) => {
            e.preventDefault();
            handleEdit();
          }}
        >
          <Title
            text={noteTitle ?? note.data.title}
            isDisabled={false}
            onChangeEvent={setNoteTitle}
            onBlurEvent={handleEdit}
          />
          <TextArea
            className="h-auto resize-none bg-background-light text-small text-text-light focus:text-primary-light focus:outline-none dark:bg-background-dark dark:text-text-dark dark:focus:text-primary-dark"
            placeholder="type something here"
            text={noteContent ?? note.data.content}
            onChangeEvent={setNoteContent}
            onBlurEvent={handleEdit}
            isDisabled={false}
          />
        </form>
      </main>
    </>
  );
};

export default NotePage;
