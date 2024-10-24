import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/ordering-home"); // Adjust the path based on your routing
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500 text-white text-center">
      <div className="bg-blue-700 rounded-lg p-10 shadow-lg">
        <h1 className="text-4xl font-bold mb-4">Transaction Completed!</h1>
        <p className="mb-6">
          Thank you for your order! We appreciate your business and look forward
          to serving you again.
        </p>
        <button
          onClick={handleReturnHome}
          className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition"
        >
          Return to Ordering Home
        </button>
      </div>
    </div>
  );
};

export default Checkout;
