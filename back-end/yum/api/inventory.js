const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// Get all inventory products
router.get("/", (req, res) => {
  const sql = "SELECT * FROM inventory"; // Fetch all inventory products
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all inventory products:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch all inventory products" });
    }
    res.json(results);
  });
});

// Get a specific product by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM inventory WHERE inventory_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching inventory product:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch inventory product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(results[0]);
  });
});

// Update a specific product by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    category,
    quantity,
    ppu,
    supplier_id,
    date_added,
    expiry_date,
    status,
  } = req.body;

  const sql =
    "UPDATE inventory SET product_name = ?, category = ?, quantity = ?, ppu = ?, supplier_id = ?, date_added = ?, expiry_date = ?, status = ? WHERE inventory_id = ?";

  db.query(
    sql,
    [
      product_name,
      category,
      quantity,
      ppu,
      supplier_id,
      date_added,
      expiry_date,
      status,
      id,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating inventory product:", err);
        return res
          .status(500)
          .json({ message: "Failed to update inventory product" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated successfully" });
    }
  );
});

// Delete a specific product by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM inventory WHERE inventory_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error deleting inventory product:", err);
      return res
        .status(500)
        .json({ message: "Failed to delete inventory product" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

module.exports = router;
