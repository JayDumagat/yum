// In your existing routes file (menu_item_ingredients.js or similar)

// Import necessary modules
const express = require("express");
const db = require("../config/db"); // Database connection

const router = express.Router();

// Route to handle adding ingredients to a menu item
router.post("/", (req, res) => {
  const { menu_item_id, ingredients } = req.body;

  if (
    !menu_item_id ||
    !Array.isArray(ingredients) ||
    ingredients.length === 0
  ) {
    return res.status(400).json({ message: "Invalid data provided" });
  }

  // Prepare SQL to insert each ingredient for the menu item
  const sql =
    "INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id) VALUES ?";

  // Create an array of values to insert (menu_item_id, ingredient_id)
  const values = ingredients.map((ingredient) => [
    menu_item_id,
    ingredient.ingredient_id,
  ]);

  // Insert into the database
  db.query(sql, [values], (err, results) => {
    if (err) {
      console.error("Error adding ingredients to menu item:", err);
      return res
        .status(500)
        .json({ message: "Failed to add ingredients to menu item" });
    }

    res.json({ message: "Ingredients successfully added to menu item" });
  });
});

module.exports = router;
