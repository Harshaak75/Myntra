import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GridSellerDashboard from "./Components/GridSellerDashboard";
import SellerCatalog from "./Pages/SellerPages/Seller.Cataloguing.js";
import { SellerSignin } from "./Pages/SellerPages/Seller.Signin.js";
import Layout from "./Components/Layout.jsx";
import SellerForm from "./Pages/SellerPages/Seller.AccountDetails"
import SellerDeatils from "./Pages/SellerPages/Seller.ShopDetails.js";
import { SellerLogin } from "./Pages/SellerPages/Seller.Login.js";

// const topbar = ["MEN", "WOMEN", "KIDS", "LIVING", "BEAUTY"];

// Define icon sizes
// const iconSizes: Record<string, number> = {
//   User: 24,
//   Heart: 20,
//   ShoppingBag: 22,
//   Menu: 18,
// };

// const icon_size = [20, 20, 20, 24]

function App() {
  return (
    <div className="h-screen bg-gray-100">
      {/* <Signin/> */}

      <Router>
        <Routes>
          {/* ✅ Route without Navbar */}
          <Route path="/" element={<SellerSignin />} />
          <Route path="/SellerLogin" element={<SellerLogin />} />

          {/* ✅ Routes with Navbar (Wrapped inside Layout) */}
          <Route element={<Layout />}>
            <Route path="/seller/dashboard" element={<GridSellerDashboard />} />
            <Route path="/seller/cataloguing" element={<SellerCatalog />} />
            <Route path="/accountDetails" element={<SellerForm/>} />
            <Route path="/manage-shop" element={<SellerDeatils/>} />
          </Route>
          
        </Routes>
      </Router>
    </div>
  );
}

export default App;
