import Icon from "../global/Icon";

interface DeleteButtonProps {
  onClickEvent: () => void;
}

const DeleteButton = ({ onClickEvent }: DeleteButtonProps) => {
  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-light dark:bg-danger-dark"
      onClick={onClickEvent}
    >
      <Icon iconName="delete" className="text-text-light" />
    </button>
  );
};

export default DeleteButton;
