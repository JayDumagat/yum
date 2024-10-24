import { create } from "zustand";

export const useOnlineOrderingStore = create((set) => ({
  address: "New York, NYC",
  cartCount: 2,
}));
