import { create } from "zustand";

export const useInventoryStore = create((set) => ({
  inventory: [],
  searchTerm: "",
  setSearchTerm: (term) => set({ searchTerm: term }),
  setInventory: (items) => set({ inventory: items }), // This function updates the inventory
}));
