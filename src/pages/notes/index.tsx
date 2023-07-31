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
    { userId: sessionData.user.id, noteType: "note", pinned: false },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const pinnedNotes = api.note.infiniteNotesOfType.useInfiniteQuery(
    { userId: sessionData.user.id, noteType: "note", pinned: true },
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
          {pinnedNotes.data?.pages[0]?.notes.length ? (
            <>
              <Header text="Pinned notes" />
              <InfiniteNoteList
                notes={pinnedNotes.data?.pages.flatMap((page) => page.notes)}
                isError={pinnedNotes.isError}
                isLoading={pinnedNotes.isLoading}
                hasMore={pinnedNotes.hasNextPage}
                fetchNewNotes={pinnedNotes.fetchNextPage}
              />
            </>
          ) : null}
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
