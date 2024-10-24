const express = require("express");
const db = require("../config/db"); // Import the database connection
const router = express.Router();

router.get("/", (req, res) => {
  const { status } = req.query; // Optional query parameter for filtering by status
  let sql = `
    SELECT o.*, oi.menu_item_id, oi.quantity, oi.price, mi.menu_item_name AS menu_item_name 
    FROM orders o 
    LEFT JOIN ordered_items oi ON o.order_id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id`; // Changed from mi.id to mi.menu_item_id
  let params = [];

  if (status) {
    sql += " WHERE o.status = ?";
    params.push(status);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }

    // Transform results to group ordered items by order
    const orders = results.reduce((acc, row) => {
      const { order_id, menu_item_id, quantity, price, menu_item_name } = row;

      // If the order doesn't exist in the accumulator, create it
      if (!acc[order_id]) {
        acc[order_id] = {
          ...row,
          ordered_items: [],
        };
      }

      // Push the ordered item if it exists
      if (menu_item_id) {
        acc[order_id].ordered_items.push({
          menu_item_id,
          quantity,
          price,
          menu_item_name,
        }); // Include menu_item_name
      }

      return acc;
    }, {});

    // Send the grouped orders
    res.json(Object.values(orders));
  });
});
router.get("/", (req, res) => {
  const { status } = req.query; // Optional query parameter for filtering by status
  let sql = `
    SELECT o.*, oi.menu_item_id, oi.quantity, oi.price, mi.menu_item_name AS menu_item_name 
    FROM orders o 
    LEFT JOIN ordered_items oi ON o.order_id = oi.order_id
    LEFT JOIN menu_items mi ON oi.menu_item_id = mi.menu_item_id`; // Changed from mi.id to mi.menu_item_id
  let params = [];

  if (status) {
    sql += " WHERE o.status = ?";
    params.push(status);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ message: "Failed to fetch orders" });
    }

    // Transform results to group ordered items by order
    const orders = results.reduce((acc, row) => {
      const { order_id, menu_item_id, quantity, price, menu_item_name } = row;

      // If the order doesn't exist in the accumulator, create it
      if (!acc[order_id]) {
        acc[order_id] = {
          ...row,
          ordered_items: [],
        };
      }

      // Push the ordered item if it exists
      if (menu_item_id) {
        acc[order_id].ordered_items.push({
          menu_item_id,
          quantity,
          price,
          menu_item_name,
        }); // Include menu_item_name
      }

      return acc;
    }, {});

    // Send the grouped orders
    res.json(Object.values(orders));
  });
});

// Get all pending orders
router.get("/pending", (req, res) => {
  const sql = "SELECT * FROM orders WHERE status = 'pending'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching pending orders:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch pending orders" });
    }
    res.json(results);
  });
});

// Get all completed orders
router.get("/completed", (req, res) => {
  const sql = "SELECT * FROM orders WHERE status = 'completed'";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching completed orders:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch completed orders" });
    }
    res.json(results);
  });
});

// Get a specific order by ID and its ordered items
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const orderSql = "SELECT * FROM orders WHERE order_id = ?";
  const itemsSql = "SELECT * FROM ordered_items WHERE order_id = ?";

  // Fetch the order
  db.query(orderSql, [id], (err, orderResults) => {
    if (err) {
      console.error("Error fetching order:", err);
      return res.status(500).json({ message: "Failed to fetch order" });
    }
    if (orderResults.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResults[0];

    // Fetch the ordered items for the order
    db.query(itemsSql, [id], (err, itemsResults) => {
      if (err) {
        console.error("Error fetching ordered items:", err);
        return res
          .status(500)
          .json({ message: "Failed to fetch ordered items" });
      }

      // Return the order along with its items
      res.json({ ...order, items: itemsResults });
    });
  });
});

// Create a new order with ordered items
router.post("/", (req, res) => {
  const {
    total_amount,
    cash_received,
    change_amount,
    status,
    order_date,
    items,
  } = req.body;

  const orderSql =
    "INSERT INTO orders (total_amount, cash_received, change_amount, status, order_date) VALUES (?, ?, ?, ?, ?)";

  // Start a transaction to insert the order and its items
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).json({ message: "Failed to create order" });
    }

    // Insert into orders table
    db.query(
      orderSql,
      [total_amount, cash_received, change_amount, status, order_date],
      (err, orderResults) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error creating order:", err);
            return res.status(500).json({ message: "Failed to create order" });
          });
        }

        const orderId = orderResults.insertId;

        // Prepare ordered_items SQL query
        const itemsSql =
          "INSERT INTO ordered_items (order_id, menu_item_id, quantity, price) VALUES ?";
        const orderedItemsData = items.map((item) => [
          orderId,
          item.menu_item_id,
          item.quantity,
          item.price,
        ]);

        // Insert into ordered_items table
        db.query(itemsSql, [orderedItemsData], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error creating ordered items:", err);
              return res
                .status(500)
                .json({ message: "Failed to create ordered items" });
            });
          }

          // Commit the transaction
          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                console.error("Transaction commit error:", err);
                return res
                  .status(500)
                  .json({ message: "Failed to create order" });
              });
            }

            res
              .status(201)
              .json({ message: "Order created successfully", orderId });
          });
        });
      }
    );
  });
});

// Update an order by ID (e.g., change status)
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE orders SET status = ? WHERE order_id = ?";
  db.query(sql, [status, id], (err, results) => {
    if (err) {
      console.error("Error updating order:", err);
      return res.status(500).json({ message: "Failed to update order" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order updated successfully" });
  });
});

// Delete an order by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM orders WHERE order_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error deleting order:", err);
      return res.status(500).json({ message: "Failed to delete order" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  });
});

module.exports = router;
