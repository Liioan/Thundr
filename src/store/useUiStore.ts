import { create } from "zustand";

interface UiState {
  isNoteCreatorOpen: boolean;
  setIsNoteCreatorOpen: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isNoteCreatorOpen: false,
  setIsNoteCreatorOpen: () =>
    set((state) => ({ isNoteCreatorOpen: !state.isNoteCreatorOpen })),
}));
