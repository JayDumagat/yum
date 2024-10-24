import { create } from "zustand";
import axios from "axios";

export const usePOSStore = create((set) => ({
  cart: [],
  paymentMethod: "Cash",
  selectedCategory: null,
  quantities: {},
  categories: [],
  productsByCategory: {},

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setSelectedCategory: (categoryId) => {
    console.log("Category selected:", categoryId); // Debugging log
    set({ selectedCategory: categoryId });
  },

  addToCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.menu_item_id === product.menu_item_id
      );
      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.menu_item_id === product.menu_item_id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          quantities: {
            ...state.quantities,
            [product.menu_item_name]:
              (state.quantities[product.menu_item_name] || 0) + 1,
          },
        };
      } else {
        return {
          cart: [...state.cart, { ...product, quantity: 1 }],
          quantities: {
            ...state.quantities,
            [product.menu_item_name]: 1,
          },
        };
      }
    }),

  removeFromCart: (product) =>
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.menu_item_id === product.menu_item_id
      );
      if (existingProduct && existingProduct.quantity > 1) {
        return {
          cart: state.cart.map((item) =>
            item.menu_item_id === product.menu_item_id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          quantities: {
            ...state.quantities,
            [product.menu_item_name]:
              state.quantities[product.menu_item_name] - 1,
          },
        };
      } else {
        return {
          cart: state.cart.filter(
            (item) => item.menu_item_id !== product.menu_item_id
          ),
          quantities: {
            ...state.quantities,
            [product.menu_item_name]: 0,
          },
        };
      }
    }),

  calculateTotal: () => {
    const { cart } = usePOSStore.getState();

    const subTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const tax = subTotal * 0.12; // 12% tax
    const total = subTotal + tax;

    return { subTotal, tax, total };
  },

  clearCart: () =>
    set(() => ({
      cart: [],
      quantities: {},
    })),

  fetchCategories: async () => {
    console.log("Fetching categories..."); // Log when the fetch operation starts
    try {
      const response = await axios.get("http://localhost:5000/api/categories");
      set({
        categories: response.data,
        selectedCategory: response.data[0]?.category_id, // Set the first category as the selected one
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  },

  fetchProductsByCategory: async (categoryId) => {
    console.log("Fetching products for category:", categoryId); // Log the category ID being fetched
    try {
      const response = await axios.get(
        `http://localhost:5000/api/menu_items/category/${categoryId}`
      );
      const fetchedProducts = response.data;
      console.log(fetchedProducts);
      set((state) => ({
        productsByCategory: {
          ...state.productsByCategory, // Keep the existing categories
          [categoryId]: fetchedProducts, // Update only the current category
        },
      }));
    } catch (error) {
      console.error("Error fetching products for category:", categoryId, error);
    }
  },
}));
