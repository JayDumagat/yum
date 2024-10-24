import { create } from "zustand";
import axios from "axios";

export const useStockOrderStore = create((set) => ({
  vendors: [],
  products: [],
  selectedVendor: null,
  selectedProducts: [],
  quantities: {},
  loading: false,
  setLoading: (loading) => set({ loading }),

  // Fetch vendors from backend
  fetchVendors: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("http://localhost:5000/api/suppliers");
      set({ vendors: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching vendors:", error);
      set({ loading: false });
    }
  },

  // Fetch products based on the selected vendor
  fetchProducts: async (vendorId) => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `http://localhost:5000/api/supplier_products/${vendorId}`
      );
      set({ products: response.data, loading: false });
      console.log(`Fetched products for vendor ID ${vendorId}:`, response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      set({ loading: false });
    }
  },

  selectVendor: async (vendor) => {
    set({ selectedVendor: vendor });
    if (vendor && vendor.id) {
      await this.fetchProducts(vendor.id); // Fetch products after selecting the vendor
    } else {
      console.error("Vendor is null or does not have an ID");
    }
  },

  addProduct: (product) => {
    if (product && product.id) {
      set((state) => ({
        selectedProducts: [...state.selectedProducts, product],
      }));
    } else {
      console.error("Product is null or does not have an ID");
    }
  },

  // Remove product from the selected list
  removeProduct: (productId) =>
    set((state) => {
      const filteredProducts = state.selectedProducts.filter(
        (p) => p.id !== productId
      );
      const newQuantities = { ...state.quantities };
      delete newQuantities[productId];
      return { selectedProducts: filteredProducts, quantities: newQuantities };
    }),

  // Update quantity
  updateQuantity: (productId, newQuantity) =>
    set((state) => ({
      quantities: { ...state.quantities, [productId]: newQuantity },
    })),

  resetOrder: () =>
    set({
      selectedProducts: [],
      quantities: {},
      selectedVendor: null,
    }),
}));
