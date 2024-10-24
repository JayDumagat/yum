import Layout from "../../layouts/AuthLayout";
import { ChevronLeft, ClipboardCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"; // Import useEffect
import axios from "axios"; // Import axios for making API requests

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cash, setCash] = useState("");
  const [loading, setLoading] = useState(false);
  const [change, setChange] = useState(0);

  const { cart, total, paymentMethod } = location.state || {
    cart: [],
    total: 0,
    paymentMethod: "",
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.04;

  // useEffect to calculate change whenever cash is updated
  useEffect(() => {
    const cashInput = parseFloat(cash);
    if (!isNaN(cashInput) && cashInput >= total) {
      setChange(cashInput - total);
    } else {
      setChange(0); // Reset change if cash is invalid or less than total
    }
  }, [cash, total]); // Run effect when cash or total changes

  const handleGoBack = () => {
    navigate("/point-of-sales", { state: { cart, total, paymentMethod } });
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();
    const cashInput = parseFloat(cash);

    if (cash.trim() === "" || isNaN(cashInput) || cashInput < total) {
      return window.alert(
        "Please enter a valid cash amount equal to or greater than the total."
      );
    }

    setLoading(true); // Set loading to true while processing

    // Prepare order data to be sent to the backend
    const orderData = {
      totalAmount: total,
      paymentMethod: paymentMethod,
      change: cashInput - total, // Calculate change here again for safety
      items: cart.map((item) => ({
        menu_item_id: item.menu_item_id || item.id, // Ensure the correct field is used
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      console.log("Order data being sent:", orderData);
      // Make a POST request to create a new order
      await axios.post(
        "http://localhost:5000/api/pos_orders/orders",
        orderData
      );

      // Show alert with order details
      window.alert(
        `Order Processed!\n\nEstimated waiting time: 15-20 minutes\nPayment Method: ${paymentMethod}\nTotal Amount: ₱${total.toFixed(
          2
        )}\nChange: ₱${(cashInput - total).toFixed(2)}`
      );

      // Clear cart and navigate back to POS
      navigate("/point-of-sales", {
        state: { cart: [], total: 0, paymentMethod: "" },
      });
    } catch (error) {
      console.error("Error submitting the order:", error);
      window.alert(
        "There was an error processing your order. Please try again."
      );
    } finally {
      setLoading(false); // Reset loading after processing
    }
  };

  return (
    <Layout>
      <form
        onSubmit={handleCompleteOrder}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-100"
      >
        {/* Left Column - Denominations */}
        <div className="bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Order Checkout</h2>
          <div>
            <div className="max-w-sm space-y-3">
              <div>
                <label
                  htmlFor="cash"
                  className="block text-sm font-medium mb-2 dark:text-white"
                >
                  Please input the cash amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="cash"
                    name="cash"
                    className="py-3 px-4 ps-9 pe-16 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    placeholder="0.00"
                    value={cash}
                    onChange={(e) => setCash(e.target.value)}
                    required
                  />
                  <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-4">
                    <span className="text-gray-500 dark:text-neutral-500">
                      ₱
                    </span>
                  </div>
                  <div className="absolute inset-y-0 end-0 flex items-center pointer-events-none z-20 pe-4">
                    <span className="text-gray-500 dark:text-neutral-500">
                      PHP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Summary and Change */}
        <div className="bg-gray-100 p-6">
          <h1 className="font-medium">Order Summary</h1>
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm">Subtotal:</p>
            <p className="font-bold text-sm">₱ {subtotal.toFixed(2)}</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="text-sm">Tax (4%):</p>
            <p className="font-bold text-sm">₱ {tax.toFixed(2)}</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-sm">Total:</p>
            <p className="font-bold text-sm">₱ {total.toFixed(2)}</p>
          </div>
          <div className="flex flex-row justify-between items-center mt-4">
            <p className="font-bold">Change:</p>
            <p className="font-bold text-lg">₱ {change.toFixed(2)}</p>
          </div>

          {/* Display the items in the cart */}
          <div className="p-6 max-h-[300px] overflow-y-auto flex flex-col gap-2">
            {cart.map((item, index) => (
              <div key={index} className="flex flex-row">
                {/* Placeholder image; replace with actual item.image if available */}
                <img
                  src={item.image || "https://placehold.co/80x112"}
                  alt={item.name}
                  className="rounded-md w-20 h-28"
                />
                <div>
                  <div className="p-4">
                    <p className="text-md">{item.menu_item_name}</p>
                    <p className="text-gray-500 text-xs font-medium">
                      Qty: {item.quantity}
                    </p>
                    <p>₱ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex flex-row justify-between items-center">
          <div>
            <button
              type="button"
              onClick={handleGoBack}
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
            >
              <ChevronLeft className="shrink-0 size-4" />
              Go back
            </button>
          </div>
          <div>
            <button
              type="submit"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              disabled={loading}
            >
              {loading ? "Processing..." : "Complete order"}
              <ClipboardCheck className="shrink-0 size-4" />
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default Checkout;
