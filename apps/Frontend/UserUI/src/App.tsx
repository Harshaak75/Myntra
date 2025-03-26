import "./App.css";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Search, User, LucideIcon } from "lucide-react";
import {logo} from "./ImagesCollection";

import GridSellerDashboard from "./Components/GridSellerDashboard";
import SellerCatalog from "./Pages/Seller.Cataloguing";

// const topbar = ["MEN", "WOMEN", "KIDS", "LIVING", "BEAUTY"];
const partner_topbar = [
  "Home",
  "Buying & Inventory",
  "Catalog",
  "Orders & Refunds",
  "Growth",
  "Pricing, Promo & Ads",
  "Payment",
  "Buiness Health",
  "Reports",
  "Support",
];
// const icons: Record<string, LucideIcon> = {
//   User,
//   Heart,
//   ShoppingBag,
//   Menu,
// };

const seller_icons: Record<string, LucideIcon> = {
  Search,
  User,
};

const seller_icons_sizes: Record<string, number> = {
  Search: 18,
  User: 18,
};

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
        <Navbar
          menus={partner_topbar}
          showSearchBar={false}
          IconName={seller_icons}
          IconSizes={seller_icons_sizes}
          Iconslabel={false}
          path={logo}
        />

        <Routes>
          <Route path="/" element={<GridSellerDashboard />} />
          <Route path="/seller/cataloguing" element={<SellerCatalog />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
