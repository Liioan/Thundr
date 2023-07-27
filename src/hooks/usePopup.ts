import { useUiStore } from "~/store/useUiStore";

const usePopup = () => {
  const { setIsPopupOpen, setPopupMessage, setIsPopupError } = useUiStore();

  const openPopup = (message: string, isError: boolean) => {
    setIsPopupOpen(true);
    setPopupMessage(message);
    setIsPopupError(isError);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupMessage(null);
    setIsPopupError(false);
  };

  return { openPopup, closePopup };
};

export default usePopup;
