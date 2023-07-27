import { api } from "~/utils/api";
import Icon from "../global/Icon";
import { useUiStore } from "~/store/useUiStore";
import usePopup from "~/hooks/usePopup";
import { useRouter } from "next/router";

interface DeleteButtonProps {
  id: string;
}

const DeleteButton = ({ id }: DeleteButtonProps) => {
  const router = useRouter();
  const { openPopup } = usePopup();

  const deleteNote = api.note.deleteNote.useMutation({
    onSuccess(message) {
      openPopup(message, false);
      router.back();
    },
    onError(data) {
      openPopup(data.message, true);
    },
  });

  return (
    <button
      className="flex h-8 w-8 items-center justify-center rounded-full bg-danger-light dark:bg-danger-dark"
      onClick={() => {
        deleteNote.mutate({ noteId: id });
      }}
    >
      <Icon iconName="delete" className="text-text-light" />
    </button>
  );
};

export default DeleteButton;
