import { type NextPage } from "next";
import Head from "next/head";
import Main from "~/components/ui/Main";
import RenderNotesList from "~/components/global/RenderNotesList";
import NoNotesScreen from "~/components/global/NoNotesScreen";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

const List: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const hasUserNotes = api.note.hasUserNotes.useQuery({
    userId: sessionData.user.id,
    noteType: "todoList",
  }).data;

  return (
    <>
      <Head>
        <title>{`Todo lists`}</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes ? (
          <RenderNotesList noteType="todoList" headerText="todo lists" />
        ) : (
          <NoNotesScreen noteType="todo" />
        )}
      </Main>
    </>
  );
};

export default List;
