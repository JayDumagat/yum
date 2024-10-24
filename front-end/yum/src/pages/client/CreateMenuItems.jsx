import Layout from "../../layouts/AuthLayout";
import { Combobox } from "@headlessui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateMenuItems() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  // Units of measurement
  const units = ["kg", "g", "ml", "pc", "pcs"];

  useEffect(() => {
    // Fetch categories and inventory items from the API
    const fetchData = async () => {
      try {
        const [categoryRes, inventoryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/categories"),
          axios.get("http://localhost:5000/api/inventory"),
        ]);
        setCategories(categoryRes.data);
        setInventoryItems(inventoryRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle ingredient selection and updating quantity and unit
  const handleIngredientSelection = (ingredient) => {
    if (
      selectedIngredients.some(
        (item) => item.inventory_id === ingredient.inventory_id
      )
    ) {
      setSelectedIngredients(
        selectedIngredients.filter(
          (i) => i.inventory_id !== ingredient.inventory_id
        )
      );
    } else {
      setSelectedIngredients([
        ...selectedIngredients,
        { ...ingredient, quantity: 1, unit: "kg" },
      ]);
    }
  };

  // Update for handling category selection
  const handleCategorySelection = (category) => {
    setSelectedCategory(category); // Store the full category object
    console.log(category);
  };

  const handleQuantityChange = (inventory_id, quantity) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.inventory_id === inventory_id
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };

  const handleReduceQuantity = (inventory_id, currentQuantity) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.inventory_id === inventory_id
          ? { ...item, quantity: Math.max(0, currentQuantity - 1) } // Prevent quantity from going below 0
          : item
      )
    );
  };

  const handleIncreaseQuantity = (inventory_id, currentQuantity) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.inventory_id === inventory_id
          ? { ...item, quantity: currentQuantity + 1 }
          : item
      )
    );
  };

  const handleUnitChange = (inventory_id, unit) => {
    setSelectedIngredients((prevIngredients) =>
      prevIngredients.map((item) =>
        item.inventory_id === inventory_id ? { ...item, unit: unit } : item
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Ensure selectedCategory is not null
      if (!selectedCategory) {
        alert("Please select a category");
        return;
      }

      // Log form data for debugging
      console.log("Form Data:", formData);

      // Send the menu item data
      const menuItemResponse = await axios.post(
        "http://localhost:5000/api/menu_items/",
        {
          category: selectedCategory.category_id,
          name: formData.name, // Ensure this matches backend expectations
          price: formData.price,
          description: formData.description,
        }
      );

      const menuItemId = menuItemResponse.data.menuItemId; // Adjust to match backend response

      // Check if there are selected ingredients
      if (selectedIngredients.length > 0) {
        await axios.post("http://localhost:5000/api/menu_item_ingredients", {
          menu_item_id: menuItemId,
          ingredients: selectedIngredients.map((ingredient) => ({
            ingredient_id: ingredient.inventory_id,
          })),
        });
      }

      alert("Menu item and ingredients successfully created!");
      navigate("/menu-items");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to create menu item");
    }
  };

  // Filter categories based on query
  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((category) =>
          category.category_name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <div className="mt-5 p-4 relative z-10 bg-white border rounded-xl sm:mt-10 md:p-10 dark:bg-neutral-900 dark:border-neutral-700">
          <form onSubmit={handleSubmit}>
            <div className="max-w-sm">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Enter the name of the menu item"
              />
            </div>

            <div className="max-w-sm">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="₱"
              />
            </div>

            {/* Category Selection */}
            <div className="mb-4 sm:mb-8">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                Category
              </label>
              {loading ? (
                <p>Loading categories...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="relative">
                  <Combobox
                    value={selectedCategory}
                    onChange={handleCategorySelection}
                  >
                    <div className="relative">
                      <Combobox.Input
                        onChange={(e) => setQuery(e.target.value)}
                        className="py-3 ps-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Select a category..."
                        displayValue={(category) =>
                          category ? category.category_name : ""
                        }
                      />
                      <Combobox.Button className="absolute top-1/2 end-3 -translate-y-1/2">
                        <svg
                          className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500"
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
                          <path d="m7 15 5 5 5-5"></path>
                          <path d="m7 9 5-5 5 5"></path>
                        </svg>
                      </Combobox.Button>
                    </div>

                    <Combobox.Options className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700">
                      {filteredCategories.length === 0 && query !== "" ? (
                        <Combobox.Option
                          value={query}
                          className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                        >
                          Create &apos;{query}&apos;
                        </Combobox.Option>
                      ) : (
                        filteredCategories.map((category) => (
                          <Combobox.Option
                            key={category.category_id}
                            value={category} // Set value to the whole category object
                            className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                          >
                            <div className="flex justify-between items-center w-full">
                              {category.category_name}{" "}
                              {/* Always show the name here */}
                              <span
                                className={`shrink-0 size-3.5 ${
                                  selectedCategory?.category_id ===
                                  category.category_id
                                    ? "block"
                                    : "hidden"
                                }`}
                              >
                                <svg
                                  className="shrink-0 size-3.5 text-blue-600 dark:text-blue-500"
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
                                  <path d="M20 6 9 17l-5-5"></path>
                                </svg>
                              </span>
                            </div>
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Combobox>
                </div>
              )}
            </div>

            {/* Ingredient Selection with Combobox */}
            <div className="mb-4 sm:mb-8">
              <label
                htmlFor="ingredients"
                className="block mb-2 text-sm font-medium dark:text-white"
              >
                Ingredients
              </label>

              <div className="relative">
                <Combobox
                  value={selectedIngredients}
                  onChange={handleIngredientSelection}
                >
                  <div className="relative">
                    <Combobox.Input
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      className="py-3 ps-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                      placeholder="Search ingredients..."
                    />
                    <Combobox.Button className="absolute top-1/2 end-3 -translate-y-1/2">
                      <svg
                        className="shrink-0 size-3.5 text-gray-500 dark:text-neutral-500"
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
                        <path d="m7 15 5 5 5-5"></path>
                        <path d="m7 9 5-5 5 5"></path>
                      </svg>
                    </Combobox.Button>
                  </div>
                  <Combobox.Options className="absolute z-50 w-full max-h-72 p-1 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700">
                    {inventoryItems
                      .filter((item) =>
                        item.product_name
                          .toLowerCase()
                          .includes(query.toLowerCase())
                      )
                      .map((item) => (
                        <Combobox.Option
                          key={item.inventory_id}
                          value={item}
                          className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                        >
                          <div className="flex justify-between items-center w-full">
                            {item.product_name}
                            <span
                              className={`shrink-0 size-3.5 ${
                                selectedCategory === item.product_name
                                  ? "block"
                                  : "hidden"
                              }`}
                            >
                              <svg
                                className="shrink-0 size-3.5 text-blue-600 dark:text-blue-500"
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
                                <path d="M20 6 9 17l-5-5"></path>
                              </svg>
                            </span>
                          </div>
                        </Combobox.Option>
                      ))}
                  </Combobox.Options>
                </Combobox>
              </div>
            </div>

            <div className="mb-4 sm:mb-8 max-h-72 overflow-y-auto overflow-x-hidden">
              {selectedIngredients.length > 0 && (
                <div className="flex flex-col">
                  <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                      <div className="border rounded-lg overflow-hidden dark:border-neutral-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                          <thead className="bg-gray-50 dark:bg-neutral-700">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                              >
                                Quantity
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                              >
                                Measurement
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y  divide-gray-200 dark:divide-neutral-700">
                            {selectedIngredients.map((ingredient) => (
                              <tr key={ingredient.inventory_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                  {ingredient.product_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                  <div className="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg dark:bg-neutral-900 dark:border-neutral-700">
                                    <div className="flex items-center gap-x-1.5">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleReduceQuantity(
                                            ingredient.inventory_id,
                                            ingredient.quantity
                                          )
                                        }
                                        className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
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
                                      <input
                                        className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none dark:text-white"
                                        type="number"
                                        value={ingredient.quantity}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            ingredient.inventory_id,
                                            e.target.value
                                          )
                                        }
                                      />
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleIncreaseQuantity(
                                            ingredient.inventory_id,
                                            ingredient.quantity
                                          )
                                        }
                                        className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
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
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                  <select
                                    value={ingredient.unit}
                                    onChange={(e) =>
                                      handleUnitChange(
                                        ingredient.inventory_id,
                                        e.target.value
                                      )
                                    }
                                    className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                  >
                                    {units.map((unit) => (
                                      <option
                                        key={unit}
                                        value={unit}
                                        className="cursor-pointer py-2 px-4 w-full text-sm text-gray-800 hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                                      >
                                        {unit}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleIngredientSelection(ingredient)
                                    }
                                    className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4 sm:mb-8">
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2 dark:text-white"
              >
                Description
              </label>
              <textarea
                id="description"
                className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                rows="3"
                placeholder="Input a short description about the item..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              Add Item
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
