const express = require("express");
const db = require("../config/db");

const router = express.Router();

// Add item to cart
router.post("/cart", (req, res) => {
  const { menu_item_id, quantity } = req.body;

  if (!menu_item_id || !quantity) {
    return res
      .status(400)
      .json({ message: "menu_item_id and quantity are required" });
  }

  // Check if the item is already in the cart
  const checkSql = "SELECT * FROM cart WHERE menu_item_id = ?";
  db.query(checkSql, [menu_item_id], (err, results) => {
    if (err) {
      console.error("Error checking cart item:", err);
      return res.status(500).json({ message: "Failed to check cart item" });
    }

    if (results.length > 0) {
      // Item already exists, update quantity
      const newQuantity = results[0].quantity + quantity;
      const updateSql = "UPDATE cart SET quantity = ? WHERE cart_id = ?";
      db.query(updateSql, [newQuantity, results[0].cart_id], (err) => {
        if (err) {
          console.error("Error updating cart item:", err);
          return res
            .status(500)
            .json({ message: "Failed to update cart item" });
        }
        return res.json({ message: "Cart item updated successfully" });
      });
    } else {
      // Insert new item
      const sql = "INSERT INTO cart (menu_item_id, quantity) VALUES (?, ?)";
      db.query(sql, [menu_item_id, quantity], (err, results) => {
        if (err) {
          console.error("Error adding to cart:", err);
          return res.status(500).json({ message: "Failed to add to cart" });
        }
        res
          .status(201)
          .json({ message: "Item added to cart", cartId: results.insertId });
      });
    }
  });
});

// Update cart item quantity
router.put("/cart/:cart_id", (req, res) => {
  const { cart_id } = req.params;
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ message: "Quantity is required" });
  }

  const sql = "UPDATE cart SET quantity = ? WHERE cart_id = ?";
  db.query(sql, [quantity, cart_id], (err, results) => {
    if (err) {
      console.error("Error updating cart item:", err);
      return res.status(500).json({ message: "Failed to update cart item" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item updated successfully" });
  });
});

// Remove item from cart
router.delete("/cart/:cart_id", (req, res) => {
  const { cart_id } = req.params;

  const sql = "DELETE FROM cart WHERE cart_id = ?";
  db.query(sql, [cart_id], (err, results) => {
    if (err) {
      console.error("Error deleting cart item:", err);
      return res.status(500).json({ message: "Failed to delete cart item" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item deleted successfully" });
  });
});
router.get("/cart", (req, res) => {
  const sql = `
        SELECT 
          c.cart_id,
          c.menu_item_id,
          c.quantity,
          m.menu_item_name AS item_name,
          m.description AS item_description,
          m.price AS item_price
        FROM 
          cart c
        JOIN 
          menu_items m ON c.menu_item_id = m.menu_item_id
      `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({ message: "Failed to fetch cart" });
    }
    res.json(results);
  });
});

module.exports = router;
