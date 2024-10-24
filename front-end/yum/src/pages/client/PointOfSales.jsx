import Layout from "../../layouts/AuthLayout";
import { usePOSStore } from "../../store/usePOSStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";

const PointOfSales = () => {
  const navigate = useNavigate();

  const {
    cart,
    paymentMethod,
    selectedCategory,
    categories,
    productsByCategory,
    setPaymentMethod,
    setSelectedCategory,
    addToCart,
    removeFromCart,
    fetchCategories,
    fetchProductsByCategory,
    calculateTotal,
  } = usePOSStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    }
  }, [selectedCategory, fetchProductsByCategory]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert(
        "Your cart is empty. Please add items before proceeding to payment."
      );
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method before proceeding.");
      return;
    }

    const totals = calculateTotal();

    const orderData = {
      cart,
      total: totals.total,
      paymentMethod,
    };

    navigate("/checkout", { state: orderData });
  };

  const totals = calculateTotal();

  return (
    <Layout>
      <div className="md:grid md:grid-cols-4 gap-4 p-6 bg-gray-100 max-h-screen">
        <div className="col-span-3">
          {/* Menu Categories using Headless UI Tabs */}
          <Tab.Group className="border-b border-gray-200 dark:border-neutral-700 ">
            <Tab.List className="flex gap-x-1 w-auto overflow-x-auto mb-4">
              {categories.map((category) => (
                <Tab
                  key={category.category_id}
                  className={({ selected }) =>
                    `-mb-px py-3 px-4 inline-flex items-center gap-x-2 text-xs font-medium text-center border rounded-t-lg ${
                      selected
                        ? "bg-white border-b-transparent text-blue-600 dark:bg-neutral-800 dark:border-b-gray-800 dark:text-white"
                        : "bg-gray-50 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
                    }`
                  }
                  onClick={() => setSelectedCategory(category.category_id)}
                >
                  {category.category_name}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels className="mt-3">
              {categories.map((category) => (
                <Tab.Panel key={category.category_id}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {productsByCategory[category.category_id]?.length > 0 ? (
                      productsByCategory[category.category_id].map(
                        (product) => (
                          <div
                            onClick={() => addToCart(product)}
                            key={product.menu_item_id}
                            className=" cursor-pointer max-w-xs flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:border-t-blue-500 dark:shadow-neutral-700/70"
                          >
                            <div className="p-4 md:p-5">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                                {product.menu_item_name}
                              </h3>
                              <p className="mt-2 text-gray-500 dark:text-neutral-400">
                                {product.description}
                              </p>
                              <button className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-600 dark:focus:text-blue-600">
                                ₱ {parseFloat(product.price).toFixed(2)}
                                <svg
                                  className="shrink-0 size-4"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m9 18 6-6-6-6"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p>No products available in this category.</p>
                    )}
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="col-span-1 bg-white p-4 shadow-md rounded-lg">
          {/* Order Summary */}
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <ul className="space-y-2 max-h-56 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.menu_item_id}
                  className="py-2 px-3 bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700"
                >
                  <div className="w-full flex justify-between items-center gap-x-3">
                    <div>
                      <span className="block font-medium text-sm text-gray-800 dark:text-white">
                        {item.menu_item_name}
                      </span>
                      <span className="block text-xs text-gray-500 dark:text-neutral-400">
                        ₱ {parseFloat(item.price).toFixed(2)} x {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1.5">
                      <button
                        type="button"
                        className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        onClick={() => removeFromCart(item)} // Remove item from cart
                      >
                        <svg
                          className="shrink-0 size-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                        </svg>
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        onClick={() => addToCart(item)} // Add item to cart again
                      >
                        <svg
                          className="shrink-0 size-3.5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          )}

          <ul className="mt-3 flex flex-col">
            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
              <div className="flex items-center justify-between w-full">
                <span>Subtotal</span>
                <span>₱ {totals.subTotal.toFixed(2)}</span>
              </div>
            </li>
            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200">
              <div className="flex items-center justify-between w-full">
                <span>
                  VAT <span className="text-gray-700 text-xs">(12%)</span>
                </span>
                <span>₱ {totals.tax.toFixed(2)}</span>
              </div>
            </li>
            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200">
              <div className="flex items-center justify-between w-full">
                <span>Total</span>
                <span>₱ {totals.total.toFixed(2)}</span>
              </div>
            </li>
          </ul>

          <div className="mt-4">
            <label htmlFor="paymentMethod" className="block font-bold mb-2">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Cash">Cash</option>
              <option value="Mobile Payment">E-wallet (Gcash)</option>
            </select>
          </div>
          <button
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-lg"
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PointOfSales;
