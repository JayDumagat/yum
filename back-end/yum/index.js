// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socketIo = require("socket.io");

// Import API routes
const suppliers = require("./api/suppliers");
const stockOrders = require("./api/stock_orders");
const supplierProducts = require("./api/supplier_products");
const inventory = require("./api/inventory");
const categories = require("./api/categories");
const menu_items = require("./api/menu_items");
const menu_item_ingredients = require("./api/menu_item_ingredients");
const pos_orders = require("./api/pos_orders");
const orders = require("./api/orders");
const cart = require("./api/cart");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(bodyParser.json());

//API

app.use("/api/inventory", inventory);

app.use("/api/stock_orders", stockOrders);

app.use("/api/suppliers", suppliers);

app.use("/api/supplier_products", supplierProducts);

app.use("/api/categories", categories);

app.use("/api/menu_items", menu_items);

app.use("/api/menu_item_ingredients", menu_item_ingredients);

app.use("/api/pos_orders", pos_orders);

app.use("/api/orders", orders);

app.use("/api/cart", cart);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("A client disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
