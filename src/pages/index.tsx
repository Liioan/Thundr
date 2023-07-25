import Head from "next/head";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import Header from "~/components/ui/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import NoteShowcase from "~/components/NoteShowcase";
import { OpenNoteCreatorButton } from "~/components/global/NoteCreator";
import LoadingScreen from "~/components/global/LoadingScreen";
import { ResponsiveWrapper } from "~/components/global/ResponsiveWrapper";
import { NoteListWrapper } from "~/components/global/NoteListWrapper";

const AllNotesSection = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;
  const notes = api.note.getAllNotes.useQuery({
    userId: sessionData.user.id,
  });

  if (notes.isLoading)
    return (
      <>
        <Header text="All notes" />
        <LoadingScreen />
      </>
    );

  return (
    <>
      {notes.data != null ? (
        <ResponsiveWrapper>
          <Header text="All notes" />
          <NoteListWrapper>
            {notes.data?.map((note) => (
              <NoteShowcase
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                reminderDate={note.reminderDate}
                pinned={note.pinned}
              />
            ))}
          </NoteListWrapper>
        </ResponsiveWrapper>
      ) : (
        <div>no notes</div>
      )}
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
      <main className="flex h-screen flex-col bg-background-light px-[25px] pt-24 transition-colors duration-200 dark:bg-background-dark">
        <AllNotesSection />
        <OpenNoteCreatorButton />
      </main>
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
