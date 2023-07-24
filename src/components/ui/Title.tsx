import {
  useRef,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useLayoutEffect,
} from "react";

interface TitleProps {
  text: string;
  isDisabled?: boolean;
  onChangeEvent?: Dispatch<SetStateAction<string | undefined>>;
  onBlurEvent?: () => void;
}

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

const Title = ({
  text,
  isDisabled = true,
  onChangeEvent,
  onBlurEvent,
}: TitleProps) => {
  const handleChange = (newValue: string) => {
    if (onChangeEvent != null) {
      onChangeEvent(newValue);
    }
  };

  const insertText = () => {
    if (isDisabled && text.length > 20) return `${text.substring(0, 20)}...`;
    return text;
  };

  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [text]);

  return (
    <div className="after: relative after:absolute after:-bottom-[2px] after:left-0 after:h-[4px] after:w-full after:rounded-full after:bg-secondary-light after:content-['']  dark:after:bg-secondary-dark ">
      <textarea
        ref={inputRef}
        style={{ height: 0 }}
        disabled={isDisabled}
        className={`mb-2 resize-none text-medium font-medium text-secondary-light focus:text-primary-light focus:outline-none  dark:text-secondary-dark dark:focus:text-primary-dark ${
          isDisabled
            ? "max-h-8 max-w-[250px] overflow-hidden bg-foreground-light dark:bg-foreground-dark "
            : " w-full bg-background-light dark:bg-background-dark"
        }`}
        value={insertText()}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={onBlurEvent}
      />
    </div>
  );
};

export default Title;
