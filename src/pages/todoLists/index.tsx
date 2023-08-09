import { type NextPage } from "next";
import Head from "next/head";
import Main from "~/components/ui/Main";
import RenderNotesList from "~/components/global/RenderNotesList";
import NoNotesScreen from "~/components/global/NoNotesScreen";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import LoadingScreen from "~/components/global/LoadingScreen";
import { OpenNoteCreatorButton } from "~/components/global/NoteCreator";

const List: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const hasUserNotes = api.note.hasUserNotes.useQuery({
    userId: sessionData.user.id,
    noteType: "todoList",
  });

  if (hasUserNotes.isLoading)
    return (
      <>
        <Head>
          <title>Todo lists</title>
          <meta name="description" content="Note app" />
          <link rel="icon" href="/favicon_dark.svg" />
        </Head>
        <Main>
          <LoadingScreen />
          <OpenNoteCreatorButton />
        </Main>
      </>
    );

  return (
    <>
      <Head>
        <title>Todo lists</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes.data ? (
          <RenderNotesList noteType="todoList" headerText="todo lists" />
        ) : (
          <NoNotesScreen noteType="todo" />
        )}
        <OpenNoteCreatorButton />
      </Main>
    </>
  );
};

export default List;
