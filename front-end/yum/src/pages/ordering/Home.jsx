import { useEffect, useState } from "react";
import OrderingLayout from "../../layouts/OrderingLayout";
import { Search } from "lucide-react";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [loading, setLoading] = useState(true); // State to track loading status

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/menu_items"
        ); // Adjust the API endpoint as necessary
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (menu_item_id) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/cart", {
        menu_item_id,
        quantity: 1, // Default quantity
      });
      alert(response.data.message); // Display success message
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    ); // Loading state
  }

  return (
    <OrderingLayout>
      <div className="min-h-screen bg-gray-100">
        {/* Search Bar */}
        <div className="max-w-sm mx-auto p-4 space-y-3">
          <div>
            <label
              htmlFor="search"
              className="block text-sm font-medium mb-2 dark:text-white"
            >
              Hi, what are you looking for?
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                name="search"
                className="py-3 px-4 pl-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                placeholder="Search for food"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
                <Search className="shrink-0 size-4 text-gray-400 dark:text-neutral-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 p-4">
          {products.map((product) => (
            <div
              key={product.menu_item_id} // Use the actual ID from your database
              className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
            >
              <img
                className="w-full h-48 object-cover rounded-t-xl"
                src={product.image || "https://via.placeholder.com/320x240.png"} // Fallback image
                alt={product.menu_item_name} // Use the actual name from your database
              />
              <div className="p-4 md:p-5">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  {product.menu_item_name}{" "}
                  {/* Use the actual name from your database */}
                </h3>
                <p className="mt-1 text-gray-500 dark:text-neutral-400">
                  {product.description}{" "}
                  {/* Use the actual description from your database */}
                </p>
                <button
                  className="mt-2 py-2 px-3 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={() => addToCart(product.menu_item_id)}
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </OrderingLayout>
  );
}
