import Icon from "~/components/global/Icon";

interface XButtonProps {
  onClickEvent?: () => void;
}

const XButton = ({ onClickEvent }: XButtonProps) => {
  return (
    <button
      className="flex h-6 w-6 items-center justify-center rounded-5 border-[1px] border-danger-light bg-foreground-light text-danger-light dark:border-danger-dark dark:bg-foreground-dark dark:text-danger-dark"
      onClick={onClickEvent}
    >
      <Icon iconName="close" className="text-xl" />
    </button>
  );
};

export default XButton;
