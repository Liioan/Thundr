import Head from "next/head";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { OpenNoteCreatorButton } from "~/components/global/NoteCreator";
import Main from "~/components/ui/layout/Main";
import NoNotesScreen from "~/components/global/NoNotesScreen";
import RenderNotesList from "~/components/global/RenderNotesList";
import { useHotkeys } from "@mantine/hooks";
import usePopup from "~/hooks/usePopup";
import LoadingScreen from "~/components/global/LoadingScreen";

const Home: NextPage = () => {
  const { openPopup } = usePopup();
  useHotkeys([
    ["ctrl+shift+v", () => openPopup("vovota is a big pepega", false)],
  ]);

  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const hasUserNotes = api.note.hasUserNotes.useQuery({
    userId: sessionData.user.id,
  });

  if (hasUserNotes.isLoading)
    return (
      <>
        <Head>
          <title>Thundr</title>
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
        <title>Thundr</title>
        <meta name="description" content="Note app" />
        <link rel="icon" href="/favicon_dark.svg" />
      </Head>
      <Main>
        {hasUserNotes.data ? (
          <RenderNotesList headerText="notes" />
        ) : (
          <NoNotesScreen noteType="note" />
        )}
        <OpenNoteCreatorButton />
      </Main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
