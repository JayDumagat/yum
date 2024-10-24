const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// Endpoint to create a new stock order
router.post("/", (req, res) => {
  const {
    supplier_id,
    product_id, // Coming from supplier_products
    quantity,
    cost_per_unit,
    total_cost,
    order_date,
  } = req.body;

  // Begin transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err);
      return res.status(500).json({ message: "Transaction start failed" });
    }

    // Insert stock order
    const sql =
      "INSERT INTO stock_orders (supplier_id, product_id, quantity, cost_per_unit, total_cost, order_date) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [
        supplier_id,
        product_id,
        quantity,
        cost_per_unit,
        total_cost,
        order_date,
      ],
      (err, results) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error inserting stock order:", err);
            return res
              .status(500)
              .json({ message: "Failed to create stock order" });
          });
        }

        // Get product name from supplier_products based on product_id
        const getProductSQL =
          "SELECT product_name FROM supplier_products WHERE product_id = ?";
        db.query(getProductSQL, [product_id], (err, productResults) => {
          if (err || productResults.length === 0) {
            return db.rollback(() => {
              console.error("Error fetching product name:", err);
              return res
                .status(500)
                .json({ message: "Failed to fetch product name" });
            });
          }

          const product_name = productResults[0].product_name;

          // Check if product exists in inventory by product_name
          const checkInventorySQL =
            "SELECT quantity FROM inventory WHERE product_name = ?";
          db.query(
            checkInventorySQL,
            [product_name],
            (err, inventoryResult) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error checking inventory:", err);
                  return res
                    .status(500)
                    .json({ message: "Failed to check inventory" });
                });
              }

              if (inventoryResult.length > 0) {
                // Product exists, update quantity
                const newQuantity = inventoryResult[0].quantity + quantity;
                const updateInventorySQL =
                  "UPDATE inventory SET quantity = ? WHERE product_name = ?";
                db.query(
                  updateInventorySQL,
                  [newQuantity, product_name],
                  (err, updateResult) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error("Error updating inventory:", err);
                        return res
                          .status(500)
                          .json({ message: "Failed to update inventory" });
                      });
                    }

                    // Commit transaction after successful update
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error("Transaction commit error:", err);
                          return res
                            .status(500)
                            .json({ message: "Transaction commit failed" });
                        });
                      }

                      console.log("Inventory updated successfully");
                      return res.status(201).json({
                        message:
                          "Stock order and inventory updated successfully",
                        id: results.insertId,
                        supplier_id,
                        product_id,
                        product_name, // Adding product name in the response
                        quantity,
                        cost_per_unit,
                        total_cost,
                        order_date,
                      });
                    });
                  }
                );
              } else {
                // Product does not exist, insert new row in inventory
                const insertInventorySQL =
                  "INSERT INTO inventory (product_name, category, quantity, ppu, supplier_id, date_added) VALUES (?, ?, ?, ?, ?, ?)";
                db.query(
                  insertInventorySQL,
                  [
                    product_name, // Insert the fetched product name
                    "your_category_here", // Make sure you define a valid category
                    quantity,
                    cost_per_unit, // Assuming price per unit is your ppu
                    supplier_id,
                    new Date(), // date_added
                  ],
                  (err, insertResult) => {
                    if (err) {
                      return db.rollback(() => {
                        console.error("Error inserting into inventory:", err);
                        return res
                          .status(500)
                          .json({ message: "Failed to insert into inventory" });
                      });
                    }

                    // Commit transaction after successful insert
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error("Transaction commit error:", err);
                          return res
                            .status(500)
                            .json({ message: "Transaction commit failed" });
                        });
                      }

                      console.log("Product added to inventory");
                      return res.status(201).json({
                        message:
                          "Stock order created and product added to inventory",
                        id: results.insertId,
                        supplier_id,
                        product_id,
                        product_name, // Adding product name in the response
                        quantity,
                        cost_per_unit,
                        total_cost,
                        order_date,
                      });
                    });
                  }
                );
              }
            }
          );
        });
      }
    );
  });
});

module.exports = router;
