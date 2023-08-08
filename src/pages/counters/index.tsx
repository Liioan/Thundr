import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import NoNotesScreen from "~/components/global/NoNotesScreen";
import RenderNotesList from "~/components/global/RenderNotesList";
import Main from "~/components/ui/Main";
import { api } from "~/utils/api";

const List: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const hasUserNotes = api.note.hasUserNotes.useQuery({
    userId: sessionData.user.id,
    noteType: "counter",
  }).data;

  return (
    <>
      <Head>
        <title>{`Note list`}</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes ? (
          <RenderNotesList noteType="counter" headerText="counters" />
        ) : (
          <NoNotesScreen noteType="counter" />
        )}
      </Main>
    </>
  );
};

export default List;
