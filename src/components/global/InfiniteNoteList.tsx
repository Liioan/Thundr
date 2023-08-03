import InfiniteScroll from "react-infinite-scroll-component";
import LoadingScreen from "./LoadingScreen";
import NoteShowcase from "./NoteShowcase";
import { NoteListWrapper } from "../ui/NoteListWrapper";

interface Note {
  id: string;
  content: string;
  createdAt: Date;
  title: string;
  type: string;
  pinnedByMe: boolean;
  reminderDate: string | null;
}

interface InfiniteNoteListProps {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewNotes: () => Promise<unknown>;
  notes?: Note[];
}

const InfiniteNoteList = ({
  notes,
  isError,
  isLoading,
  fetchNewNotes,
  hasMore = false,
}: InfiniteNoteListProps) => {
  if (isLoading) return <LoadingScreen />;
  if (isError) return <div>error</div>;

  if (notes == null || notes.length === 0) {
    return <div>no notes</div>;
  }

  return (
    <ul>
      <InfiniteScroll
        dataLength={notes.length}
        next={fetchNewNotes}
        hasMore={hasMore}
        loader={<LoadingScreen />}
      >
        <NoteListWrapper>
          {notes.map((note) => (
            <NoteShowcase
              key={note.id}
              content={note.content}
              id={note.id}
              pinned={note.pinnedByMe}
              reminderDate={note.reminderDate}
              title={note.title}
              noteType={note.type}
            />
          ))}
        </NoteListWrapper>
      </InfiniteScroll>
    </ul>
  );
};

export default InfiniteNoteList;
