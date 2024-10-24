import OrderingLayout from "../../layouts/OrderingLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Removed axios import since we're using dummy data

const Cart = () => {
  const navigate = useNavigate();

  // Dummy data for cart items
  const dummyCartItems = [
    { id: 1, menu_item_id: 101, quantity: 2, lastUpdated: "2 hours ago" },
    { id: 2, menu_item_id: 102, quantity: 1, lastUpdated: "3 hours ago" },
    { id: 3, menu_item_id: 103, quantity: 3, lastUpdated: "1 hour ago" },
  ];

  // Dummy data for menu items
  const dummyMenuItems = [
    {
      id: 101,
      name: "Spaghetti Bolognese",
      description: "Classic Italian pasta dish with rich meat sauce.",
      price: 12.99,
      image: "https://via.placeholder.com/150", // Placeholder image
    },
    {
      id: 102,
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing.",
      price: 9.99,
      image: "https://via.placeholder.com/150", // Placeholder image
    },
    {
      id: 103,
      name: "Margherita Pizza",
      description: "Traditional pizza topped with fresh mozzarella and basil.",
      price: 14.99,
      image: "https://via.placeholder.com/150", // Placeholder image
    },
  ];

  const [cartItems, setCartItems] = useState(dummyCartItems);
  const [menuItems, setMenuItems] = useState(dummyMenuItems);

  // Increase item quantity
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const menuItem = menuItems.find((menu) => menu.id === item.menu_item_id);
      return total + (menuItem ? menuItem.price : 0) * item.quantity;
    }, 0);
  };

  // Calculate tax (assuming a fixed tax rate of 10%)
  const calculateTax = (subtotal) => {
    return subtotal * 0.1; // 10% tax
  };

  // Calculate total
  const calculateTotal = (subtotal) => {
    return subtotal + calculateTax(subtotal);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal);

  const handleCheckout = () => {
    navigate("/ordering-checkout", { state: { cartItems } }); // Ensure cartItems is defined here
  };

  return (
    <OrderingLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="grid grid-cols-1 gap-6 h-[310px] overflow-auto">
          {cartItems.map((item) => {
            const menuItem = menuItems.find(
              (menu) => menu.id === item.menu_item_id
            );
            return (
              menuItem && (
                <a
                  key={item.id}
                  className="block border border-gray-200 rounded-lg hover:shadow-sm focus:outline-none dark:border-neutral-700"
                  href="#"
                >
                  <div className="relative flex items-center overflow-hidden">
                    <img
                      className="w-32 sm:w-48 h-full absolute inset-0 object-cover rounded-l-lg"
                      src={menuItem.image} // Use image from menu item
                      alt={menuItem.name}
                    />

                    <div className="grow p-4 ms-32 sm:ms-48">
                      <div className="min-h-24 flex flex-col justify-center">
                        <h3 className="font-semibold text-sm text-gray-800 dark:text-neutral-300">
                          {menuItem.name} {/* Use name from menu item */}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                          {menuItem.description}{" "}
                          {/* Use description from menu item */}
                        </p>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white mt-2">
                          ${menuItem.price.toFixed(2)}{" "}
                          {/* Use price from menu item */}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-4 mt-3">
                          <button
                            className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                            onClick={() => decreaseQuantity(item.id)}
                          >
                            -
                          </button>
                          <span className="text-lg font-bold text-gray-800 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-1 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300"
                            onClick={() => increaseQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>

                        {/* Last Updated Info */}
                        <div className="mt-5">
                          <p className="text-xs text-gray-500 dark:text-neutral-500">
                            Last updated {item.lastUpdated}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              )
            );
          })}
        </div>

        {/* Totals Table */}
        <div className="flex flex-col mt-8">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="border rounded-lg shadow overflow-hidden dark:border-neutral-700 dark:shadow-gray-900">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-800 dark:text-neutral-200">
                        Description
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-gray-800 dark:text-neutral-200">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        Subtotal
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-right">
                        ${subtotal.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        Tax (10%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-right">
                        ${tax.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="font-bold">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 text-right">
                        ${total.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-8">
          <button
            onClick={handleCheckout}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-500"
          >
            Checkout
          </button>
        </div>
      </div>
    </OrderingLayout>
  );
};

export default Cart;
