const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// Get all menu items
router.get("/", (req, res) => {
  const sql = "SELECT * FROM menu_items"; // Fetch all menu items
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching all menu items:", err);
      return res
        .status(500)
        .json({ message: "Failed to fetch all menu items" });
    }
    res.json(results);
  });
});

// Get a specific menu item by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM menu_items WHERE menu_item_id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error fetching menu item:", err);
      return res.status(500).json({ message: "Failed to fetch menu item" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(results[0]);
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
  const { name: menu_item_name, category, price, description } = req.body;

  console.log("Menu Item Name:", menu_item_name);
  console.log("Parameters:", [menu_item_name, category, price, description]);

  // Validate input
  if (!menu_item_name || !category || !price || !description) {
    console.error("Missing fields:", {
      menu_item_name,
      category,
      price,
      description,
    });
    return res.status(400).json({ message: "All fields are required." });
  }

  const sql =
    "INSERT INTO menu_items (menu_item_name, category_id, price, description) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [menu_item_name, category, price, description],
    (err, results) => {
      if (err) {
        console.error("Error adding menu item:", err);
        return res.status(500).json({ message: "Failed to add menu item" });
      }
      res.status(201).json({
        message: "Menu item added successfully",
        menuItemId: results.insertId,
      });
    }
  );
});

router.get("/category/:category_id", (req, res) => {
  const { category_id } = req.params;
  const sql = "SELECT * FROM menu_items WHERE category_id = ?";
  db.query(sql, [category_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch products" });
    }
    res.json(results);
  });
});

// Update a specific menu item by ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { menu_item_name, category, price, description, status } = req.body;

  const sql = `
    UPDATE menu_items 
    SET menu_item_name = ?, category = ?, price = ?, description = ?, status = ? 
    WHERE menu_item_id = ?
  `;

  db.query(
    sql,
    [menu_item_name, category, price, description, status, id],
    (err, results) => {
      if (err) {
        console.error("Error updating menu item:", err);
        return res.status(500).json({ message: "Failed to update menu item" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json({ message: "Menu item updated successfully" });
    }
  );
});

// Delete a specific menu item by ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM menu_items WHERE menu_item_id = ?";

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Error deleting menu item:", err);
      return res.status(500).json({ message: "Failed to delete menu item" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted successfully" });
  });
});

module.exports = router;
