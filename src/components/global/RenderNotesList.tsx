import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Header from "../ui/Header";
import { ResponsiveWrapper } from "../ui/layout/ResponsiveWrapper";
import InfiniteNoteList from "./InfiniteNoteList";
import { useMemo } from "react";

interface RenderNotesListProps {
  noteType?: string;
  headerText: string;
}

const RenderNotesList = ({
  noteType = undefined,
  headerText,
}: RenderNotesListProps) => {
  const today = useMemo(() => new Date(), []);

  const { data: sessionData } = useSession();
  if (!sessionData) return null;

  const inputData = { userId: sessionData.user.id, noteType: noteType };

  const notes = api.note.infiniteNotes.useInfiniteQuery(inputData, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const pinnedNotes = api.note.infinitePinnedNotes.useInfiniteQuery(inputData, {
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const currentNotes = api.note.infiniteCurrentNotes.useInfiniteQuery(
    { ...inputData, date: today },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  return (
    <>
      <ResponsiveWrapper>
        {currentNotes.data?.pages[0]?.notes.length ? (
          <>
            <Header text={`Today is a day to`} />
            <InfiniteNoteList
              notes={currentNotes.data?.pages.flatMap((page) => page.notes)}
              isError={currentNotes.isError}
              isLoading={currentNotes.isLoading}
              hasMore={currentNotes.hasNextPage}
              fetchNewNotes={currentNotes.fetchNextPage}
            />
          </>
        ) : null}
        {pinnedNotes.data?.pages[0]?.notes.length ? (
          <>
            <Header text={`Pinned ${headerText}`} />
            <InfiniteNoteList
              notes={pinnedNotes.data?.pages.flatMap((page) => page.notes)}
              isError={pinnedNotes.isError}
              isLoading={pinnedNotes.isLoading}
              hasMore={pinnedNotes.hasNextPage}
              fetchNewNotes={pinnedNotes.fetchNextPage}
            />
          </>
        ) : null}
        <Header text={`All ${headerText}`} />
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

export default RenderNotesList;
