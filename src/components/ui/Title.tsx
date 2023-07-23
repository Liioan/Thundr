import { type Dispatch, type SetStateAction } from "react";

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
  const handleChange = (newValue: string) => {
    if (onChangeEvent != null) {
      onChangeEvent(newValue);
    }
  };

  return (
    <div className="after: relative after:absolute after:-bottom-[2px] after:left-0 after:h-[4px] after:w-full after:rounded-full after:bg-secondary-light after:content-['']  dark:after:bg-secondary-dark ">
      <input
        type="text"
        disabled={isDisabled}
        className={`mb-2 w-min  text-medium font-medium text-secondary-light focus:text-primary-light focus:outline-none  dark:text-secondary-dark dark:focus:text-primary-dark ${
          isDisabled
            ? "bg-foreground-light dark:bg-foreground-dark"
            : "bg-background-light dark:bg-background-dark "
        }`}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={onBlurEvent}
      />
    </div>
  );
};

export default Title;
