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
    noteType: "markdownNotes",
  }).data;

  return (
    <>
      <Head>
        <title>{`Markdown note list`}</title>
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes ? (
          <RenderNotesList
            noteType="markdownNote"
            headerText="markdown notes"
          />
        ) : (
          <NoNotesScreen noteType="markdown note" />
        )}
      </Main>
    </>
  );
};

export default List;
