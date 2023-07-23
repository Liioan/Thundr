import Head from "next/head";
import { type GetServerSideProps, type NextPage } from "next";
import { getServerAuthSession } from "../server/auth";
import Header from "~/components/ui/Header";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { BeatLoader } from "react-spinners";
import NoteShowcase from "~/components/NoteShowcase";

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
        <div className="flex h-40 flex-col items-center justify-center gap-4">
          <BeatLoader color="#44CBCA" />
          <p>loading</p>
        </div>
      </>
    );

  return (
    <>
      {notes.data != null ? (
        <div className="flex flex-col gap-[25px]">
          <Header text="All notes" />
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
        </div>
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
      <main className="h-[10000px] bg-background-light px-[25px] pt-24 transition-colors duration-200 dark:bg-background-dark">
        <AllNotesSection />
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
