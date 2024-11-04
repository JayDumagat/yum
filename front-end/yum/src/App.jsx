import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../src/pages/Login";
import OrderingHome from "./pages/ordering/Home";
import Home from "../src/landing/Home";
import Register from "../src/pages/Register";
import Dashboard from "./pages/client/Dashboard";
import Profile from "./pages/Profile";
import PointOfSales from "./pages/client/PointOfSales";
import Accounts from "./pages/client/Accounts";
import RolesAndPermission from "./pages/client/RolesAndPermission";
import Inventory from "./pages/client/Inventory";
import Checkout from "./pages/client/Checkout";
import MenuItems from "./pages/client/MenuItems";
import InventoryBrowse from "./pages/client/InventoryBrowse";
import ReviewStockOrder from "./pages/client/ReviewStockOrder";
import CreateMenuItems from "./pages/client/CreateMenuItems";
import Orders from "./pages/client/Orders";
import Browse from "../src/pages/ordering/Browse";
import Cart from "../src/pages/ordering/Cart";
import OrderingCheckout from "../src/pages/ordering/Checkout";
import OrderingOrders from "../src/pages/ordering/Orders";
import C2C from "../src/pages/ordering/C2C";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />

     
      <Route path="/C2C" element={<C2C />} />
      <Route path="/register" element={<Register />} />
      <Route path="/menu-items" element={<MenuItems />} />
      <Route path="/login" element={<Login />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/employee-accounts" element={<Accounts />} />
      <Route path="/overview" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/roles-and-permissions" element={<RolesAndPermission />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/inventory/browse" element={<InventoryBrowse />} />
      <Route path="/menu-items/new-item" element={<CreateMenuItems />} />
      <Route path="/orders" element={<Orders />} />
      <Route
        path="/inventory/browse/review-order"
        element={<ReviewStockOrder />}
      />
      <Route path="/point-of-sales" element={<PointOfSales />} />
      {/*
      <Route path="/members" element={<Membership />} />
      */}

      <Route path="/ordering-home" element={<OrderingHome />} />
      <Route path="/ordering-browse" element={<Browse />} />
      <Route path="/ordering-cart" element={<Cart />} />
      <Route path="/ordering-checkout" element={<OrderingCheckout />} />
      <Route path="/ordering-orders" element={<OrderingOrders />} />
    </Routes>
  </Router>
);

export default App;
