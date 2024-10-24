// store.js
import { create } from "zustand";

export const useDialogStore = create((set) => ({
  isOpen: false,
  openDialog: () => set({ isOpen: true }),
  closeDialog: () => set({ isOpen: false }),
}));
