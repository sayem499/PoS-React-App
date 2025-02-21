import "./css/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout.jsx";
import Dashboard from "./views/dashboard.jsx";
import Customers from "./views/customers.jsx";
import Products from "./views/products.jsx";
import Suppliers from "./views/suppliers.jsx";
import Profile from "./views/profile.jsx";
import Login from "./views/login.jsx";
import Users from "./views/users.jsx";
import Sale from "./views/sale.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="sale" element={<Sale />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="products" element={<Products />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="profile" element={<Profile />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer />
    </div>
  );
}

export default App;
