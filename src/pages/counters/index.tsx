import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import LoadingScreen from "~/components/global/LoadingScreen";
import NoNotesScreen from "~/components/global/NoNotesScreen";
import { OpenNoteCreatorButton } from "~/components/global/NoteCreator";
import RenderNotesList from "~/components/global/RenderNotesList";
import Main from "~/components/ui/Main";
import { api } from "~/utils/api";

const List: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const hasUserNotes = api.note.hasUserNotes.useQuery({
    userId: sessionData.user.id,
    noteType: "counter",
  });

  if (hasUserNotes.isLoading)
    return (
      <>
        <Head>
          <title>Counters list</title>
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
        <title>Counters list</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes.data ? (
          <RenderNotesList noteType="counter" headerText="counters" />
        ) : (
          <NoNotesScreen noteType="counter" />
        )}
        <OpenNoteCreatorButton />
      </Main>
    </>
  );
};

export default List;
