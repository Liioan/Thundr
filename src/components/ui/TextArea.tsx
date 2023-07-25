import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useLayoutEffect,
  useRef,
  useEffect,
} from "react";

interface TextAreaProps {
  className: string;
  text: string;
  isDisabled?: boolean;
  onChangeEvent?: Dispatch<SetStateAction<string | undefined>>;
  onBlurEvent?: () => void;
  placeholder?: string;
  maxLength?: number;
}

const updateTextAreaSize = (textArea?: HTMLTextAreaElement) => {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
};

const TextArea = ({
  text,
  isDisabled = true,
  onChangeEvent,
  onBlurEvent,
  className = "",
  placeholder = "",
  maxLength = 150,
}: TextAreaProps) => {
  const handleChange = (newValue: string) => {
    if (onChangeEvent != null) {
      onChangeEvent(newValue);
    }
  };

  const onResize = () => {
    updateTextAreaSize(textAreaRef.current);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  useEffect(() => {
    onResize();
  }, []);

  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [text]);
  return (
    <textarea
      maxLength={maxLength}
      ref={inputRef}
      style={{ height: 0 }}
      disabled={isDisabled}
      className={className}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={onBlurEvent}
      value={text}
      placeholder={placeholder}
    />
  );
};

export default TextArea;
