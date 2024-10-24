const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// Get all supplier products
router.get("/", (req, res) => {
  const sql = "SELECT * FROM supplier_products"; // Fetch all supplier products
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all supplier products:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch all supplier products" });
    }
    res.json(results);
  });
});

// Get products by supplier ID
router.get("/:supplierId", (req, res) => {
  const { supplierId } = req.params;
  const sql = "SELECT * FROM supplier_products WHERE supplier_id = ?";
  db.query(sql, [supplierId], (err, results) => {
    if (err) {
      console.error("Error fetching supplier products:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch supplier products" });
    }
    res.json(results);
  });
});

module.exports = router;
