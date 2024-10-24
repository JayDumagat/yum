import { useState, useEffect } from "react";
import { Combobox, ComboboxOptions, ComboboxOption } from "@headlessui/react";
import Layout from "../../layouts/AuthLayout";
import axios from "axios";

const NewStockOrder = () => {
  const [orderProducts, setOrderProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [note, setNote] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [productList, setProductList] = useState([]);

  // Fetch suppliers from the API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/suppliers");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedVendor) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/supplier_products/${selectedVendor.supplier_id}` // Use the supplierId route
          );
          console.log(response.data); // Check the response structure
          // Map the fetched products to the format you need
          const formattedProducts = response.data.map((product) => ({
            sku: product.product_id,
            name: product.product_name,
            cost: parseFloat(product.price), // Convert price to float
          }));
          setProductList(formattedProducts);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      } else {
        setProductList([]); // Reset if no vendor selected
      }
    };

    fetchProducts();
  }, [selectedVendor]);

  const handleOrderChange = (index, amount) => {
    const newProducts = [...orderProducts];
    newProducts[index].order += amount;
    setOrderProducts(newProducts);
  };

  const addProductToOrder = (product) => {
    setOrderProducts((prev) => {
      const existingProductIndex = prev.findIndex(
        (item) => item.sku === product.sku
      );
      if (existingProductIndex >= 0) {
        const updatedProducts = [...prev];
        updatedProducts[existingProductIndex].order += 1;
        return updatedProducts;
      }
      return [...prev, { ...product, order: 1 }];
    });
    setSelectedProduct(null); // Reset the selected product after adding
  };

  const handleSubmitOrder = async () => {
    const orderPromises = orderProducts.map(async (product) => {
      if (product.order > 0) {
        const total_cost = (product.cost * product.order).toFixed(2);
        const orderData = {
          supplier_id: selectedVendor.supplier_id,
          product_id: product.sku,
          quantity: product.order,
          cost_per_unit: product.cost,
          total_cost,
          order_date: new Date().toISOString().slice(0, 10), // Format the date
        };

        try {
          await axios.post("http://localhost:5000/api/stock_orders", orderData);
          return true; // Indicate success
        } catch (error) {
          console.error("Error submitting stock order:", error);
          return false; // Indicate failure
        }
      }
      return false; // If the order is 0, don't submit
    });

    const results = await Promise.all(orderPromises);
    if (results.every((result) => result)) {
      alert("Stock orders submitted successfully!");
      // Optionally, reset the order products and selected vendor
      setOrderProducts([]);
      setSelectedVendor(null);
      setNote("");
    } else {
      alert(
        "Some orders failed to submit. Please check the console for errors."
      );
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6 border bg-white">
        <h2 className="text-xl font-semibold mb-4">New Stock Order</h2>

        {/* Vendor Selection */}
        <div className="mb-4">
          <label htmlFor="vendor-search" className="block mb-2">
            Select Vendor
          </label>
          <Combobox value={selectedVendor} onChange={setSelectedVendor}>
            <div className="relative">
              <Combobox.Input
                className="w-full p-2 border rounded-md"
                placeholder="Select vendor"
                displayValue={(vendor) => (vendor ? vendor.name : "")}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                {/* SVG Icon */}
              </Combobox.Button>
            </div>
            <ComboboxOptions>
              {suppliers.map((vendor) => (
                <ComboboxOption
                  key={vendor.id}
                  value={vendor}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {vendor.name}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-blue-600"
                          }`}
                        >
                          {/* SVG Checkmark */}
                        </span>
                      )}
                    </>
                  )}
                </ComboboxOption>
              ))}
            </ComboboxOptions>
          </Combobox>
        </div>

        {/* Display Selected Vendor Information */}
        {selectedVendor && (
          <div className="mb-4">
            <p className="font-medium">Vendor Information:</p>
            <p>Name: {selectedVendor.name}</p>
            <p>Address: {selectedVendor.address}</p>
            <p>Contact: {selectedVendor.contact}</p>
            <p>Phone: {selectedVendor.phone}</p>
            <p>Email: {selectedVendor.email}</p>
          </div>
        )}

        {/* Product Selection */}
        <div className="mb-6">
          <label htmlFor="product-search" className="block mb-2">
            Add Product
          </label>
          <Combobox value={selectedProduct} onChange={addProductToOrder}>
            <div className="relative">
              <Combobox.Input
                className="w-full p-2 border rounded-md"
                placeholder="Select product"
                displayValue={(product) => (product ? product.name : "")}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Combobox.Button>
            </div>
            <Combobox.Options>
              {productList.map((product) => (
                <Combobox.Option
                  key={product.sku}
                  value={product}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? "bg-blue-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ active, selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {product.name}
                      </span>
                      {selected && (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-blue-600"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 10a1 1 0 011 1v4a1 1 0 11-2 0v-4a1 1 0 011-1zm8-1a1 1 0 100 2 1 1 0 000-2zm-8-4a1 1 0 010 2h4a1 1 0 110 2H6a1 1 0 110-2h4V5H6zm7-2a1 1 0 110 2h-1V2h1a1 1 0 110 2h-1a1 1 0 110-2h1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Combobox>
        </div>

        {/* Product Order Summary */}
        <div>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Product Name</th>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Cost</th>
              </tr>
            </thead>
            <tbody>
              {orderProducts.map((product, index) => (
                <tr key={product.sku} className="border-b">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.sku}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleOrderChange(index, -1)}
                      disabled={product.order <= 0}
                      className="px-2 py-1 bg-gray-200 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="px-4">{product.order}</span>
                    <button
                      onClick={() => handleOrderChange(index, 1)}
                      className="px-2 py-1 bg-gray-200 rounded-r-md"
                    >
                      +
                    </button>
                  </td>
                  <td className="p-2">${product.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <textarea
            className="w-full p-2 border rounded-md mb-4"
            rows="3"
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          <button
            type="button"
            onClick={handleSubmitOrder}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Submit Order
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NewStockOrder;
