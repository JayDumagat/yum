import { useEffect } from "react";
import Layout from "../../layouts/AuthLayout";
import { CircleCheck, TriangleAlert, Check } from "lucide-react";
import useOrderStore from "../../store/useOrderStore";

const Orders = () => {
  const {
    processingOrders,
    readyForPickupOrders,
    fetchOrders,
    changeOrderStatus,
    listenForOrderUpdates,
  } = useOrderStore();

  useEffect(() => {
    fetchOrders();
    listenForOrderUpdates();
  }, [fetchOrders, listenForOrderUpdates]);

  const handleChangeToReady = (orderId) => {
    changeOrderStatus(orderId, "ready");
  };

  const handleChangeToComplete = (orderId) => {
    changeOrderStatus(orderId, "completed");
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-screen overflow-auto">
        {/* Processing Orders */}
        <div>
          <h2 className="text-lg font-bold mb-4">Processing Orders</h2>
          <div className="grid grid-cols-1 gap-4">
            {processingOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
              >
                <div className="flex justify-between items-center border-b rounded-t-xl py-3 px-4 md:px-5 dark:border-neutral-700">
                  <h3 className="lg:text-lg md:text-md font-bold text-gray-800 dark:text-white">
                    Order #{order.order_id}
                  </h3>
                  <div className="flex items-center gap-x-1">
                    <button
                      onClick={() => handleChangeToReady(order.order_id)}
                      className="hs-tooltip-toggle size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
                    >
                      <Check className="shrink-0 size-4" />
                      <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700">
                        ready for pickup
                      </span>
                    </button>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  {Array.isArray(order.ordered_items) &&
                  order.ordered_items.length > 0 ? (
                    <p className="mt-2 text-gray-500 dark:text-neutral-400 lg:text-base md:text-sm">
                      {order.ordered_items
                        .map(
                          (item) => `${item.quantity} ${item.menu_item_name}`
                        )
                        .join(", ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-500 dark:text-neutral-400">
                      No items found.
                    </p>
                  )}
                  <span className="mt-3 py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                    <TriangleAlert className="shrink-0 size-3" />
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready for Pickup Orders */}
        <div>
          <h2 className="text-lg font-bold mb-4">Ready for Pickup Orders</h2>
          <div className="grid grid-cols-1 gap-4">
            {readyForPickupOrders.map((order) => (
              <div
                key={order.order_id}
                className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70"
              >
                <div className="flex justify-between items-center border-b rounded-t-xl py-3 px-4 md:px-5 dark:border-neutral-700">
                  <h3 className="lg:text-lg md:text-md font-bold text-gray-800 dark:text-white">
                    Order #{order.order_id}
                  </h3>
                  <div className="flex items-center gap-x-1">
                    <button
                      onClick={() => handleChangeToComplete(order.order_id)}
                      className="hs-tooltip-toggle size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
                    >
                      <Check className="shrink-0 size-4" />
                      <span className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-neutral-700">
                        mark as completed
                      </span>
                    </button>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  {Array.isArray(order.ordered_items) &&
                  order.ordered_items.length > 0 ? (
                    <p className="mt-2 text-gray-500 dark:text-neutral-400 lg:text-base md:text-sm">
                      {order.ordered_items
                        .map(
                          (item) => `${item.quantity} ${item.menu_item_name}`
                        )
                        .join(", ")}
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-500 dark:text-neutral-400">
                      No items found.
                    </p>
                  )}
                  <span className="mt-3 py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-green-100 text-green-800 rounded-full dark:bg-red-500/10 dark:text-red-500">
                    <CircleCheck className="shrink-0 size-3" /> {order.status}{" "}
                    to be picked up
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
