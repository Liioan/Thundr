import { type Dispatch, type SetStateAction } from "react";
import TextArea from "./TextArea";

interface TitleProps {
  text: string;
  isDisabled?: boolean;
  onChangeEvent?: Dispatch<SetStateAction<string | undefined>>;
  onBlurEvent?: () => void;
}

const Title = ({
  text,
  isDisabled = true,
  onChangeEvent,
  onBlurEvent,
}: TitleProps) => {
  const insertText = () => {
    if (isDisabled && text.length > 20) return `${text.substring(0, 20)}...`;
    return text;
  };

  return (
    <div className="after: relative after:absolute after:-bottom-[2px] after:left-0 after:h-[4px] after:w-full after:rounded-full after:bg-secondary-light after:content-['']  dark:after:bg-secondary-dark ">
      <TextArea
        className={`mb-2 resize-none bg-transparent text-medium font-medium text-secondary-light focus:text-primary-light focus:outline-none  dark:text-secondary-dark dark:focus:text-primary-dark ${
          isDisabled
            ? "max-h-8 w-full cursor-pointer overflow-hidden "
            : " w-full"
        }`}
        text={insertText()}
        isDisabled={isDisabled}
        onChangeEvent={onChangeEvent}
        onBlurEvent={onBlurEvent}
      />
    </div>
  );
};

export default Title;
