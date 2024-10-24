const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// Get all categories
router.get("/", (req, res) => {
  const sql = "SELECT * FROM categories"; // Fetch all categories
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all categories:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch all categories" });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { category_name } = req.body; // Capture category_name from the request body

  // Validate the input (optional, but recommended)
  if (!category_name) {
    return res.status(400).json({ message: "Category name is required" });
  }

  const sql = "INSERT INTO categories (category_name) VALUES (?)"; // SQL query to insert new category
  db.query(sql, [category_name], (err, results) => {
    if (err) {
      console.error("Error adding category:", err);
      return res.status(500).json({ message: "Failed to add category" });
    }
    res
      .status(201)
      .json({
        message: "Category added successfully",
        category_id: results.insertId,
      });
  });
});

// Get a specific category by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM categories WHERE category_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching category:", err);
      return res.status(500).json({ message: "Failed to fetch category" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(results[0]);
  });
});

// Update a specific category by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { category_name, description } = req.body;

  const sql =
    "UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?";

  db.query(sql, [category_name, description, id], (err, results) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).json({ message: "Failed to update category" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category updated successfully" });
  });
});

// Delete a specific category by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM categories WHERE category_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error deleting category:", err);
      return res.status(500).json({ message: "Failed to delete category" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  });
});

module.exports = router;
