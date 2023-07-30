import { create } from "zustand";

interface UiState {
  isNoteCreatorOpen: boolean;
  isPopupError: boolean;
  isPopupOpen: boolean;
  popupMessage: string | null;
  setIsNoteCreatorOpen: (value: boolean) => void;
  setIsPopupError: (value: boolean) => void;
  setIsPopupOpen: (value: boolean) => void;
  setPopupMessage: (message: string | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isNoteCreatorOpen: false,
  isPopupError: false,
  isPopupOpen: false,
  popupMessage: null,
  setIsNoteCreatorOpen: (value) => set(() => ({ isNoteCreatorOpen: value })),
  setIsPopupError: (value) => set(() => ({ isPopupError: value })),
  setIsPopupOpen: (value) => set(() => ({ isPopupOpen: value })),
  setPopupMessage: (message) => set(() => ({ popupMessage: message })),
}));
