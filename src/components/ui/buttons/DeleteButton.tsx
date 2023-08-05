import { api } from "~/utils/api";
import usePopup from "~/hooks/usePopup";
import { useRouter } from "next/router";
import { FiTrash2 } from "react-icons/fi";

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
      <FiTrash2 className=" text-xl text-text-light" />
    </button>
  );
};

export default DeleteButton;
