import { Dialog, DialogPanel, Combobox } from "@headlessui/react";
import { useDialogStore } from "../store/useDialogStore";
import { useOrderStore } from "../store/useOrderStore";
import { useState, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import axios from "axios";

function OrderDialog() {
  const { isOpen, closeDialog } = useDialogStore();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const addOrder = useOrderStore((state) => state.addOrder);

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch vendors and products from the backend
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vendors");
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchVendors();
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts =
    query === ""
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        );

  const handleAddProduct = async () => {
    if (selectedProduct) {
      addOrder({
        vendor: selectedVendor,
        product: selectedProduct,
        quantity,
        total: selectedProduct.price * quantity,
      });

      try {
        await axios.patch(
          `http://localhost:5000/api/products/${selectedProduct.id}`,
          {
            quantity: selectedProduct.quantity + quantity,
          }
        );
        console.log("Product inventory updated successfully.");
      } catch (error) {
        console.error(
          "Error adding product to order or updating inventory:",
          error
        );
      }

      setSelectedProduct(null);
      setQuery("");
      setQuantity(1);
    }
  };

  const close = () => {
    closeDialog();
  };

  return (
    <>
      <Dialog open={isOpen} as="div" className="relative z-10" onClose={close}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md p-6">
              <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">New Stock Order</h2>

                <Combobox value={selectedVendor} onChange={setSelectedVendor}>
                  <Combobox.Label className="block font-medium">
                    Vendor:
                  </Combobox.Label>
                  <div className="relative mt-1">
                    <Combobox.Input
                      className="w-full p-2 border rounded-md"
                      displayValue={(vendor) => (vendor ? vendor.name : "")}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                    </Combobox.Button>
                    <Combobox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-md border">
                      {vendors.map((vendor) => (
                        <Combobox.Option key={vendor.id} value={vendor}>
                          {({ selected }) => (
                            <div
                              className={`cursor-pointer select-none relative p-2 ${
                                selected
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              <span
                                className={`${selected ? "font-bold" : ""}`}
                              >
                                {vendor.name}
                              </span>
                            </div>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>

                {/* Vendor Details */}
                {selectedVendor && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      <strong>Address:</strong> {selectedVendor.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Contact:</strong> {selectedVendor.contact}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Phone:</strong> {selectedVendor.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Email:</strong> {selectedVendor.email}
                    </p>
                  </div>
                )}

                {/* Product Search and Selection */}
                <Combobox value={selectedProduct} onChange={setSelectedProduct}>
                  <Combobox.Label className="block mt-4 font-medium">
                    Add Product:
                  </Combobox.Label>
                  <div className="relative mt-1">
                    <Combobox.Input
                      className="w-full p-2 border rounded-md"
                      placeholder="Search product..."
                      displayValue={(product) => (product ? product.name : "")}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                    </Combobox.Button>
                    <Combobox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 overflow-auto rounded-md border">
                      {filteredProducts.map((product) => (
                        <Combobox.Option key={product.id} value={product}>
                          {({ selected }) => (
                            <div
                              className={`cursor-pointer select-none flex justify-between relative p-2 ${
                                selected
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              <span
                                className={`${selected ? "font-bold" : ""}`}
                              >
                                {product.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                ₱{product.price}
                              </span>
                            </div>
                          )}
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  </div>
                </Combobox>

                {/* Product Quantity and Price */}
                {selectedProduct && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => setQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="bg-gray-200 p-2 rounded-l-md"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-12 text-center border-y p-2"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="bg-gray-200 p-2 rounded-r-md"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-lg font-bold">
                      ₱{selectedProduct.price * quantity}
                    </span>
                  </div>
                )}

                {/* Note Input */}
                <textarea
                  className="w-full p-2 mt-4 border rounded-md"
                  placeholder="Add a note"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={handleAddProduct}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Add Product
                  </button>
                  <button
                    onClick={close}
                    className="bg-red-500 text-white p-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default OrderDialog;
