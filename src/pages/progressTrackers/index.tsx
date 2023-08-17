import { type NextPage } from "next";
import Head from "next/head";
import Main from "~/components/ui/layout/Main";
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
    noteType: "progressTracker",
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
        <title>Progress trackers</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes.data ? (
          <RenderNotesList
            noteType="progressTracker"
            headerText="Progress trackers"
          />
        ) : (
          <NoNotesScreen noteType="progress tracker" />
        )}
        <OpenNoteCreatorButton />
      </Main>
    </>
  );
};

export default List;
