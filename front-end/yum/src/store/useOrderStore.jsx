import { create } from "zustand";
import { io } from "socket.io-client"; // Correct import for socket.io-client

// Initialize the socket connection to the server
const socket = io("http://localhost:5000"); // Replace with your server URL

const useOrderStore = create((set) => ({
  processingOrders: [],
  readyForPickupOrders: [],

  setProcessingOrders: (orders) => set({ processingOrders: orders }),
  setReadyForPickupOrders: (orders) => set({ readyForPickupOrders: orders }),

  fetchOrders: async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const orders = await res.json();

      console.log("Fetched Orders:", orders); // Log the fetched orders

      const processing = orders.filter((order) => order.status === "preparing");
      const readyForPickup = orders.filter((order) => order.status === "ready");

      console.log("Processing Orders:", processing); // Log processed orders
      console.log("Ready for Pickup Orders:", readyForPickup); // Log ready orders

      set({
        processingOrders: processing,
        readyForPickupOrders: readyForPickup,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  },

  listenForOrderUpdates: () => {
    socket.on("orderUpdated", (updatedOrder) => {
      set((state) => {
        const processing = state.processingOrders.filter(
          (order) => order.order_id !== updatedOrder.order_id
        );
        const readyForPickup = state.readyForPickupOrders.filter(
          (order) => order.order_id !== updatedOrder.order_id
        );

        if (updatedOrder.status === "preparing") {
          processing.push(updatedOrder);
        } else if (updatedOrder.status === "ready") {
          readyForPickup.push(updatedOrder);
        }

        return {
          processingOrders: processing,
          readyForPickupOrders: readyForPickup,
        };
      });
    });
  },

  changeOrderStatus: async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      set((state) => {
        let updatedProcessingOrders = state.processingOrders;
        let updatedReadyForPickupOrders = state.readyForPickupOrders;

        if (newStatus === "ready") {
          const order = state.processingOrders.find(
            (order) => order.order_id === orderId
          );
          if (order) {
            updatedProcessingOrders = state.processingOrders.filter(
              (order) => order.order_id !== orderId
            );
            updatedReadyForPickupOrders = [
              ...state.readyForPickupOrders,
              { ...order, status: newStatus },
            ];
          }
        } else if (newStatus === "completed") {
          updatedReadyForPickupOrders = state.readyForPickupOrders.filter(
            (order) => order.order_id !== orderId
          );
        }

        return {
          processingOrders: updatedProcessingOrders,
          readyForPickupOrders: updatedReadyForPickupOrders,
        };
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  },
}));

export default useOrderStore;
