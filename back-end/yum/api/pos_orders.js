const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// POST route for creating a new order
router.post("/orders", (req, res) => {
  const { totalAmount, paymentMethod, change, items } = req.body;

  // Check if the required data is present
  if (!totalAmount || !paymentMethod || !items || items.length === 0) {
    return res.status(400).json({ message: "Missing order data" });
  }

  // Insert the order into the database
  const orderDate = new Date().toISOString().slice(0, 19).replace("T", " "); // Format date as YYYY-MM-DD HH:mm:ss
  const sqlOrder = `
    INSERT INTO orders (total_amount, cash_received, change_amount, order_date, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Prepare the values for the order insertion
  const orderValues = [
    totalAmount,
    totalAmount - change,
    change,
    orderDate,
    "preparing",
  ];

  db.query(sqlOrder, orderValues, (err, orderResults) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ message: "Failed to create order" });
    }

    const orderId = orderResults.insertId; // Get the newly created order ID

    // Insert ordered items into the database
    const sqlItems = `
      INSERT INTO ordered_items (order_id, menu_item_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `;

    const itemsPromises = items.map((item) => {
      const itemValues = [
        orderId,
        item.menu_item_id,
        item.quantity,
        item.price,
      ];
      return new Promise((resolve, reject) => {
        db.query(sqlItems, itemValues, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });

    // Wait for all items to be inserted
    Promise.all(itemsPromises)
      .then(() => {
        res
          .status(201)
          .json({ message: "Order created successfully", orderId });
      })
      .catch((error) => {
        console.error("Error inserting ordered items:", error);
        res.status(500).json({ message: "Failed to insert ordered items" });
      });
  });
});

module.exports = router;
