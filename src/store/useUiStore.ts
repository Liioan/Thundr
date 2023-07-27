import { create } from "zustand";

interface UiState {
  isNoteCreatorOpen: boolean;
  setIsNoteCreatorOpen: () => void;
  isPopupError: boolean;
  setIsPopupError: (value: boolean) => void;
  isPopupOpen: boolean;
  setIsPopupOpen: (value: boolean) => void;
  popupMessage: string | null;
  setPopupMessage: (message: string | null) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isNoteCreatorOpen: false,
  setIsNoteCreatorOpen: () =>
    set((state) => ({ isNoteCreatorOpen: !state.isNoteCreatorOpen })),
  isPopupError: false,
  setIsPopupError: (value) => set(() => ({ isPopupError: value })),
  isPopupOpen: false,
  setIsPopupOpen: (value) => set(() => ({ isPopupOpen: value })),
  popupMessage: null,
  setPopupMessage: (message) => set(() => ({ popupMessage: message })),
}));
