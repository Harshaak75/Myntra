import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GridSellerDashboard from "./Components/GridSellerDashboard";
import SellerCatalog from "./Pages/Seller.Cataloguing";
import { SellerSignin } from "./Pages/Seller.Signin";
import Layout from "./Components/Layout.jsx";

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

          {/* ✅ Routes with Navbar (Wrapped inside Layout) */}
          <Route element={<Layout />}>
            <Route path="/seller/dashboard" element={<GridSellerDashboard />} />
            <Route path="/seller/cataloguing" element={<SellerCatalog />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
