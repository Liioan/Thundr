import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GoBackButton from "~/components/global/GoBackButton";
import Title from "~/components/ui/Title";
import { api } from "~/utils/api";
import PinSwitch from "~/components/ui/PinSwitch";
import { BeatLoader } from "react-spinners";

const NotePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery({ noteId: id as string });

  const [noteContent, setNoteContent] = useState(note.data?.content);
  const [noteTitle, setNoteTitle] = useState(note.data?.title);
  const [isNotePinned, setIsNotePinned] = useState(note.data?.pinned ?? false);

  const editNote = api.note.editNote.useMutation();

  const handleEdit = () => {
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

  if (note.isLoading)
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-4">
        <BeatLoader color="#44CBCA" />
        <p>loading</p>
      </div>
    );

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
        <form className="flex flex-col gap-[25px]">
          <Title
            text={noteTitle ?? note.data.title}
            isDisabled={false}
            onChangeEvent={setNoteTitle}
            onBlurEvent={handleEdit}
          />
          <textarea
            className="h-auto resize-none bg-background-light text-small text-text-light focus:text-primary-light focus:outline-none dark:bg-background-dark dark:text-text-dark dark:focus:text-primary-dark"
            placeholder="type something here"
            value={noteContent ?? note.data.content}
            onChange={(e) => setNoteContent(e.target.value)}
            onBlur={handleEdit}
          />
        </form>
      </main>
    </>
  );
};

export default NotePage;
