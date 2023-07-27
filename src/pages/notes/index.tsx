import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import InfiniteNoteList from "~/components/global/InfiniteNoteList";
import Header from "~/components/ui/Header";
import Main from "~/components/ui/Main";
import { ResponsiveWrapper } from "~/components/ui/ResponsiveWrapper";
import { api } from "~/utils/api";

const List: NextPage = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const notes = api.note.infiniteNotesOfType.useInfiniteQuery(
    { userId: sessionData.user.id, noteType: "note" },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  return (
    <>
      <Head>
        <title>{`Note list`}</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Main>
        <ResponsiveWrapper>
          <Header text="Notes" />
          <InfiniteNoteList
            notes={notes.data?.pages.flatMap((page) => page.notes)}
            isError={notes.isError}
            isLoading={notes.isLoading}
            hasMore={notes.hasNextPage}
            fetchNewNotes={notes.fetchNextPage}
          />
        </ResponsiveWrapper>
      </Main>
    </>
  );
};

export default List;
