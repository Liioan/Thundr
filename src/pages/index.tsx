import Head from "next/head";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import Header from "~/components/ui/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { OpenNoteCreatorButton } from "~/components/global/NoteCreator";
import LoadingScreen from "~/components/global/LoadingScreen";
import { ResponsiveWrapper } from "~/components/ui/ResponsiveWrapper";
import Main from "~/components/ui/Main";
import InfiniteNoteList from "~/components/global/InfiniteNoteList";

const AllNotesSection = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const notes = api.note.infiniteNotes.useInfiniteQuery(
    { userId: sessionData.user.id },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <ResponsiveWrapper>
        <Header text="All notes" />
        <InfiniteNoteList
          notes={notes.data?.pages.flatMap((page) => page.notes)}
          isError={notes.isError}
          isLoading={notes.isLoading}
          hasMore={notes.hasNextPage}
          fetchNewNotes={notes.fetchNextPage}
        />
      </ResponsiveWrapper>
    </>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Thundr</title>
        <meta name="description" content="Note app" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Main>
        <AllNotesSection />
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
