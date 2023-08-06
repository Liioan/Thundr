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
import { motion } from "framer-motion";

type PossibleNoteContent =
  | note
  | todoList
  | decisionTree
  | counter
  | progressTracker;

const ShowMore = () => {
  return (
    <>
      <span className="font-bold text-primary-light dark:text-primary-dark">
        ...
      </span>
    </>
  );
};

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
    <p className="overflow-hidden text-small text-text-light dark:text-text-dark">
      {content.length > 150 ? (
        <>
          {content.substring(0, 150)}
          <ShowMore />
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
  return content ? (
    <p className="overflow-hidden text-small text-text-light dark:text-text-dark">
      {content.length > 150 ? (
        <>
          {content.substring(0, 150)}
          <ShowMore />
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

const RenderTodoList = ({ content }: { content: todoList }) => {
  if (content.length > 3) {
    content = content.splice(2, content.length - 3);
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
      <ShowMore />
    </div>
  );
};

const RenderCounter = ({ content }: { content: number }) => {
  return (
    <>
      <h2 className="mt-4 flex h-full -translate-y-2 items-center justify-center text-center text-4xl text-text-light dark:text-text-dark">
        {content}
      </h2>
      <ShowMore />
    </>
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
  if (type === "counter") return <RenderCounter content={content as number} />;
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
    <Link
      href={`/${noteType}s/${id}`}
      className="cursor-pointer overflow-x-hidden"
    >
      <motion.div
        className="relative  flex min-h-[150px] w-full flex-col gap-[15px] overflow-hidden rounded-15 bg-foreground-light p-[15px] dark:bg-foreground-dark lg:h-[220px]"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "backInOut", delay: 0.2 }}
      >
        <span className="absolute right-[30px] top-[30px]">
          <PinSwitch toggled={pinnedByMe} />
        </span>
        <Title text={title} />
        <div className="flex h-full flex-col justify-between">
          <RenderContent content={content ?? ""} type={noteType} />
        </div>
        <RenderDate reminderDate={reminderDate} />
      </motion.div>
    </Link>
  );
};

export default NoteShowcase;
