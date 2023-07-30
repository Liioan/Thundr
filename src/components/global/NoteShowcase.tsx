import Link from "next/link";
import Title from "../ui/Title";
import PinSwitch from "../ui/PinSwitch";
import { parseJson } from "~/utils/parseJson";
import { type markdownNote, type note } from "~/types/NoteType";

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

interface RenderComponentsProps {
  content: string;
}

const RenderNote = ({ content }: RenderComponentsProps) => {
  const parsedContent = parseJson<note>(content ?? "");

  if (parsedContent == undefined) return null;

  return parsedContent ? (
    <p className="text-small text-text-light dark:text-text-dark">
      {parsedContent.length > 100 ? (
        <>
          {parsedContent.substring(0, 100)}
          <span className="font-bold text-primary-light dark:text-primary-dark">
            {" "}
            ...
          </span>
        </>
      ) : (
        parsedContent
      )}
    </p>
  ) : (
    <span className="text-text-light opacity-50 dark:text-text-dark">
      no content
    </span>
  );
};

const RenderMarkdownNote = ({ content }: RenderComponentsProps) => {
  let parsedContent = parseJson<markdownNote>(content ?? "");

  if (parsedContent == undefined) return null;

  if (parsedContent.length > 100) {
    parsedContent = parsedContent.substring(0, 100);
  }

  return parsedContent ? (
    // <>
    //   <ReactMarkdown className="prose overflow-hidden text-text-light prose-headings:text-text-light dark:text-text-dark dark:prose-headings:text-text-dark ">
    //     {parsedContent}
    //   </ReactMarkdown>
    //   {parsedContent.length >= 100 && (
    //     <span className="font-bold text-primary-light dark:text-primary-dark">
    //       {" "}
    //       ...
    //     </span>
    //   )}
    // </>
    <p>
      {parsedContent}
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

interface RenderContentProps {
  type: string;
  content: string;
}

const RenderContent = ({ type, content }: RenderContentProps) => {
  if (type === "note") return <RenderNote content={content} />;
  if (type === "markdownNote") return <RenderMarkdownNote content={content} />;
};

interface NoteShowcaseProps {
  id: string;
  title: string;
  content: string | null;
  reminderDate: string | null;
  pinned: boolean;
  noteType: string;
}

const NoteShowcase = ({
  id,
  title,
  content,
  reminderDate,
  pinned,
  noteType,
}: NoteShowcaseProps) => {
  return (
    <Link href={`/${noteType}s/${id}`}>
      <div className="relative flex min-h-[150px] w-full flex-col gap-[10px] overflow-hidden rounded-15 bg-foreground-light p-[15px] dark:bg-foreground-dark sm:min-h-[200px]">
        <span className="absolute right-[30px] top-[30px]">
          <PinSwitch toggled={pinned} />
        </span>
        <Title text={title} />
        <RenderContent content={content ?? ""} type={noteType} />
        <RenderDate reminderDate={reminderDate} />
      </div>
    </Link>
  );
};

export default NoteShowcase;
