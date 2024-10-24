import { create } from "zustand";

const useCheckoutStore = create((set) => ({
  cash: "",
  change: 0,
  loading: false,
  dialogMessage: "",

  setCash: (value) => set({ cash: value }),
  setChange: (value) => set({ change: value }),
  setLoading: (value) => set({ loading: value }),
  setDialogMessage: (message) => set({ dialogMessage: message }),

  clearCart: () =>
    set({ cash: "", change: 0, loading: false, dialogMessage: "" }),

  handleCashChange: (cashInput, total) => {
    if (!isNaN(cashInput) && cashInput >= total) {
      set({ cash: cashInput.toString(), change: cashInput - total });
    } else {
      set({ cash: cashInput.toString(), change: 0 });
    }
  },

  completeOrder: async (cart, total, paymentMethod, cashInput) => {
    set({ loading: true });
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          total,
          paymentMethod,
          cash: cashInput,
          status: "processing", // Initial status of the order
        }),
      });

      if (response.ok) {
        const order = await response.json();
        // Clear cart and store upon successful order completion
        set({
          cash: "",
          change: 0,
          dialogMessage: "Order processed successfully!",
        });
      } else {
        const errorData = await response.json();
        set({
          dialogMessage: errorData.message || "Failed to process the order.",
        });
      }
    } catch (error) {
      set({ dialogMessage: "An error occurred while processing the order." });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useCheckoutStore;
