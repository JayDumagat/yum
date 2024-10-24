import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../layouts/AuthLayout";
import { ListPlus, FilePlus2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

export default function MenuItems() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category_name: "",
    description: "",
  });
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/menu_items"
        );
        setMenuItems(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch menu items");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories");
      }
    };

    fetchMenuItems();
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const categoryMap = Object.fromEntries(
    categories.map((cat) => [cat.category_id, cat.category_name])
  );

  const filteredItems = menuItems.filter((item) => {
    if (item.menu_item_name) {
      const isMatch = item.menu_item_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      console.log(`Item: ${item.menu_item_name}, Matches: ${isMatch}`); // Log match result
      return isMatch;
    }
    return false; // Ensure we only try to check valid item names
  });

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/categories", {
        category_name: newCategory.category_name, // Send only the required field
      });
      setCategories([...categories, newCategory]); // Update state with the new category
      setNewCategory({ category_name: "", description: "" }); // Reset form
      closeModal(); // Close the modal
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category");
    }
  };

  return (
    <Layout>
      <div className="">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-neutral-900 dark:border-neutral-700">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
                  <div className="sm:col-span-1">
                    <label htmlFor="search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="search"
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 px-3 ps-11 block w-full border-2 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        placeholder="Search"
                      />
                      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4">
                        <svg
                          className="shrink-0 size-4 text-gray-400 dark:text-neutral-500"
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
                          <circle cx="11" cy="11" r="8" />
                          <path d="m21 21-4.3-4.3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2 md:grow">
                    <div className="flex justify-end gap-x-2">
                      <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
                        <button
                          id="add-category"
                          type="button"
                          onClick={openModal}
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <ListPlus className="shrink-0 size-3.5" />
                          Add Category
                        </button>
                        <Dialog
                          open={modalIsOpen}
                          onClose={closeModal}
                          className="relative z-50"
                        >
                          <div
                            className="fixed inset-0 bg-black/30"
                            aria-hidden="true"
                          />
                          <div className="fixed inset-0 flex items-center justify-center p-4">
                            <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
                              <Dialog.Title className="text-lg font-bold">
                                Add New Category
                              </Dialog.Title>
                              {error && <p className="text-red-500">{error}</p>}
                              <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                  <label
                                    htmlFor="category_name"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Category Name
                                  </label>
                                  <input
                                    type="text"
                                    id="category_name"
                                    name="category_name"
                                    value={newCategory.category_name}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 p-2 w-full border rounded-md"
                                  />
                                </div>

                                <div className="flex justify-end">
                                  <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                  >
                                    Add Category
                                  </button>
                                </div>
                              </form>
                            </Dialog.Panel>
                          </div>
                        </Dialog>
                      </div>

                      <div className="hs-dropdown [--placement:bottom-right] relative inline-block">
                        <a
                          id="new-item"
                          href="/menu-items/new-item"
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                          <FilePlus2 className="shrink-0 size-3.5" />
                          New Item
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Product
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Category
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Description
                          </span>
                        </div>
                      </th>

                      <th scope="col" className="px-6 py-3 text-start">
                        <div className="flex items-center gap-x-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                            Price
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr
                          key={item.menu_item_id}
                          className="bg-white hover:bg-gray-50 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                        >
                          <td className="size-px whitespace-nowrap ">
                            <a className="block p-6">
                              <div className="flex items-center gap-x-4">
                                <img
                                  className="shrink-0 size-[38px] rounded-lg"
                                  src={
                                    item.image ||
                                    "https://via.placeholder.com/38"
                                  } // Placeholder image if none exists
                                  alt="Product Image"
                                />
                                <div>
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {item.menu_item_name}
                                  </span>
                                </div>
                              </div>
                            </a>
                          </td>
                          <td className="size-px whitespace-nowrap ">
                            <a
                              className="block p-6"
                              href={`menu-items/edit/${item.menu_item_id}`}
                            >
                              <div className="flex items-center gap-x-3">
                                <div className="grow">
                                  <span className="block text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                    {categoryMap[item.category_id] ||
                                      "Unknown Category"}{" "}
                                    {/* Map category ID to category name */}
                                  </span>
                                </div>
                              </div>
                            </a>
                          </td>
                          <td className="h-px w-72 min-w-72 ">
                            <a
                              className="block p-6"
                              href={`menu-items/edit/${item.menu_item_id}`}
                            >
                              <span className="block text-sm text-gray-500 dark:text-neutral-500">
                                {item.description}
                              </span>
                            </a>
                          </td>
                          <td className="size-px whitespace-nowrap ">
                            <a
                              className="block p-6"
                              href={`menu-items/edit/${item.menu_item_id}`}
                            >
                              <span className="text-sm text-gray-600 dark:text-neutral-400">
                                ₱&nbsp;{item.price}
                              </span>
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No menu items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700">
                  <div className="max-w-sm space-y-3">
                    <select
                      onChange={handleItemsPerPageChange}
                      value={itemsPerPage}
                      className="py-2 px-3 pe-9 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={6}>6</option>
                    </select>
                  </div>

                  <div>
                    <div className="inline-flex gap-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      >
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
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                        Prev
                      </button>

                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        type="button"
                        className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                      >
                        Next
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
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
