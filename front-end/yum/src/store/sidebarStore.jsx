import { create } from "zustand";

const useSidebarStore = create((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  dropdownOpen: {}, // For managing dropdown states
  toggleDropdown: (title) =>
    set((state) => ({
      dropdownOpen: {
        ...state.dropdownOpen,
        [title]: !state.dropdownOpen[title],
      },
    })),
}));

export { useSidebarStore };
