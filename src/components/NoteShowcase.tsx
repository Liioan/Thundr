import Link from "next/link";
import Title from "./ui/Title";
import PinSwitch from "./ui/PinSwitch";
import { parseJson } from "~/utils/parseJson";
import { type note } from "~/types/NoteType";

interface NoteShowcaseProps {
  id: string;
  title: string;
  content: string | null;
  reminderDate: string | null;
  pinned: boolean;
}

const NoteShowcase = ({
  id,
  title,
  content,
  reminderDate,
  pinned,
}: NoteShowcaseProps) => {
  const today = new Date().toLocaleDateString();

  let date: string | undefined;
  if (reminderDate != null) {
    date = new Date(reminderDate).toLocaleDateString();
  }

  const parsedContent = parseJson<note>(content ?? "");

  return (
    <Link href={`/notes/${id}`}>
      <div className="relative flex w-full max-w-sm flex-col gap-[10px] rounded-15 bg-foreground-light p-[15px] dark:bg-foreground-dark">
        <span className="absolute right-[30px] top-[30px]">
          <PinSwitch toggled={pinned} />
        </span>
        <Title text={title} />
        <p className="text-small text-text-light dark:text-text-dark">
          {parsedContent ? (
            parsedContent.length > 100 ? (
              <>
                {parsedContent.substring(0, 100)}
                <span className="font-bold text-primary-light dark:text-primary-dark">
                  {" "}
                  ...
                </span>
              </>
            ) : (
              parsedContent
            )
          ) : (
            <span className="text-text-light opacity-50 dark:text-text-dark">
              no content
            </span>
          )}
        </p>
        {date != null ? (
          <span
            className={`self-end text-accent-light  dark:text-accent-dark ${
              today === date
                ? "text-primary-light opacity-100 dark:text-primary-dark"
                : "opacity-50"
            }`}
          >
            {date}
          </span>
        ) : null}
      </div>
    </Link>
  );
};

export default NoteShowcase;
