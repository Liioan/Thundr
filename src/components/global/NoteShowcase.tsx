import Link from "next/link";
import Title from "../ui/Title";
import PinSwitch from "../ui/PinSwitch";
import type {
  counter,
  decisionTree,
  note,
  progressTracker,
  todoList,
} from "~/types/NoteType";
import TodoItem from "../ui/TodoItem";

type PossibleNoteContent =
  | note
  | todoList
  | decisionTree
  | counter
  | progressTracker;

interface RenderDateProps {
  reminderDate: string | null;
}

const RenderDate = ({ reminderDate }: RenderDateProps) => {
  const today = new Date().toLocaleDateString();

  let date: string | undefined;
  if (reminderDate != null) {
    date = new Date(reminderDate).toLocaleDateString();
  }

  return (
    <>
      {date != null ? (
        <span
          className={`mt-auto self-end text-accent-light  dark:text-accent-dark ${
            today === date
              ? "text-primary-light opacity-100 dark:text-primary-dark"
              : "opacity-50"
          }`}
        >
          {date}
        </span>
      ) : null}
    </>
  );
};

const RenderNote = ({ content }: { content: string }) => {
  return content ? (
    <p className="text-small text-text-light dark:text-text-dark">
      {content.length > 100 ? (
        <>
          {content.substring(0, 100)}
          <span className="font-bold text-primary-light dark:text-primary-dark">
            {" "}
            ...
          </span>
        </>
      ) : (
        content
      )}
    </p>
  ) : (
    <span className="text-text-light opacity-50 dark:text-text-dark">
      no content
    </span>
  );
};

const RenderMarkdownNote = ({ content }: { content: string }) => {
  if (content.length > 100) {
    content = content.substring(0, 100);
  }

  return content ? (
    <p>
      {content}
      <span className="font-bold text-primary-light dark:text-primary-dark">
        {" "}
        ...
      </span>
    </p>
  ) : (
    <span className="text-text-light opacity-50 dark:text-text-dark">
      no content
    </span>
  );
};

const RenderTodoList = ({ content }: { content: todoList }) => {
  if (content.length > 5) {
    content = content.splice(4, content.length - 4);
  }
  return (
    <div className="flex flex-col gap-[15px]">
      <ul className="relative flex flex-col gap-[15px]">
        {content?.map((todo, i) => {
          if (!todo.isFinished)
            return (
              <TodoItem
                key={i}
                task={todo.task}
                isFinished={todo.isFinished}
                taskId={i}
                disabled
              />
            );
        })}
      </ul>
      <ul className="flex flex-col gap-[15px]">
        {content?.map((todo, i) => {
          if (todo.isFinished)
            return (
              <TodoItem
                key={i}
                task={todo.task}
                isFinished={todo.isFinished}
                taskId={i}
                disabled
              />
            );
        })}
      </ul>
    </div>
  );
};

interface RenderContentProps {
  type: string;
  content: PossibleNoteContent;
}

const RenderContent = ({ type, content }: RenderContentProps) => {
  if (type === "note") return <RenderNote content={content as string} />;
  if (type === "markdownNote")
    return <RenderMarkdownNote content={content as string} />;
  if (type === "todoList")
    return <RenderTodoList content={content as todoList} />;
};

interface NoteShowcaseProps {
  id: string;
  title: string;
  content: PossibleNoteContent;
  reminderDate: string | null;
  pinnedByMe: boolean;
  noteType: string;
}

const NoteShowcase = ({
  id,
  title,
  content,
  reminderDate,
  pinnedByMe,
  noteType,
}: NoteShowcaseProps) => {
  return (
    <Link href={`/${noteType}s/${id}`}>
      <div className="relative flex min-h-[150px] w-full flex-col gap-[20px] overflow-hidden rounded-15 bg-foreground-light p-[15px] dark:bg-foreground-dark sm:min-h-[200px]">
        <span className="absolute right-[30px] top-[30px]">
          <PinSwitch toggled={pinnedByMe} />
        </span>
        <Title text={title} />
        <RenderContent content={content ?? ""} type={noteType} />
        <RenderDate reminderDate={reminderDate} />
      </div>
    </Link>
  );
};

export default NoteShowcase;
