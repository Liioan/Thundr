import { ReactMarkdown } from "react-markdown/lib/react-markdown";

interface RenderMarkdownProps {
  children: string;
  className?: string;
}

const RenderMarkdown = ({ children, className = "" }: RenderMarkdownProps) => {
  return (
    <ReactMarkdown
      className={`prose overflow-auto text-text-light marker:text-accent-light prose-headings:text-text-light prose-h1:h-[50px] prose-p:text-text-light prose-a:text-secondary-light prose-code:text-text-dark dark:text-text-dark dark:marker:text-accent-dark dark:prose-headings:text-text-dark dark:prose-p:text-text-dark dark:prose-a:text-secondary-dark dark:prose-code:text-text-dark ${className}`}
    >
      {children}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
