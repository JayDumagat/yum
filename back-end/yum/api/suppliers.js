const express = require("express");
const db = require("../config/db"); // Import the database connection

const router = express.Router();

// Endpoint to fetch all suppliers
router.get("/", (req, res) => {
  const sql = "SELECT * FROM suppliers";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching suppliers:", err); // Log the error
      return res.status(500).json({ message: "Failed to fetch suppliers" });
    }
    res.json(results);
  });
});
module.exports = router;
