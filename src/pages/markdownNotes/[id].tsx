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
import { ResponsiveWrapper } from "~/components/ui/ResponsiveWrapper";
import { stringify } from "~/utils/JsonUtils";
import { type markdownNote } from "~/types/NoteType";
import Main from "~/components/ui/Main";
import DeleteButton from "~/components/ui/buttons/DeleteButton";
import { GrView } from "react-icons/gr";
import { AiOutlineEdit } from "react-icons/ai";
import useDebounce from "~/hooks/useDebounce";
import { useHotkeys } from "@mantine/hooks";
import RenderMarkdown from "~/components/ui/RenderMarkdown";

const NotePage: NextPage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const note = api.note.getNoteDetails.useQuery({ noteId: id as string });
  const utils = api.useContext();

  const [noteContent, setNoteContent] = useState<string>("");
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
    const stringifiedContent = stringify<markdownNote | undefined>(noteContent);
    editNote.mutate({
      noteId: id as string,
      title: noteTitle,
      content: stringifiedContent,
    });
  };

  useDebounce(handleEdit, 500, [noteContent, noteTitle]);
  useDebounce(handleTogglePin, 500, [isNotePinned]);

  useHotkeys([["ctrl+e", () => setIsEditing((prev) => !prev)]]);

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
            }}
          >
            <Title
              text={noteTitle ?? note.data.title}
              isDisabled={false}
              onChangeEvent={setNoteTitle}
            />
            {isEditing ? (
              <TextArea
                className="h-auto resize-none bg-background-light text-small text-text-light caret-primary-light focus:outline-none dark:bg-background-dark dark:text-text-dark dark:caret-primary-dark"
                placeholder="type something here"
                text={noteContent ?? note.data.content}
                onChangeEvent={setNoteContent}
                isDisabled={false}
                maxLength={3000}
              />
            ) : (
              // <ReactMarkdown className="prose overflow-auto text-text-light marker:text-accent-light prose-headings:text-text-light prose-h1:h-[50px] prose-p:text-text-light prose-a:text-secondary-light prose-code:text-text-dark dark:text-text-dark dark:marker:text-accent-dark dark:prose-headings:text-text-dark dark:prose-p:text-text-dark dark:prose-a:text-secondary-dark dark:prose-code:text-text-dark">
              // </ReactMarkdown>
              <RenderMarkdown>
                {noteContent ?? note.data.content}
              </RenderMarkdown>
            )}
          </form>
          <div className="fixed bottom-[25px] flex items-center gap-5 self-end">
            <DeleteButton id={note.data.id} />
            <div>
              <button
                onClick={() => setIsEditing((prev) => !prev)}
                className="flex h-8 w-24 items-center justify-center gap-2 rounded-full bg-accent-light text-small font-medium text-text-light dark:bg-accent-dark"
              >
                {isEditing ? (
                  <>
                    <GrView className="text-xl" />
                    <span>View</span>
                  </>
                ) : (
                  <>
                    <AiOutlineEdit className="text-2xl" />
                    <span>Edit</span>
                  </>
                )}
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
