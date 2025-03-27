import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Import your Navbar component
import {  logo } from "../ImagesCollection";
import { Search, User, LucideIcon } from "lucide-react";

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

  const seller_icons: Record<string, LucideIcon> = {
    Search,
    User,
  };

  const seller_icons_sizes: Record<string, number> = {
    Search: 18,
    User: 18,
  };


const Layout = () => {
  return (
    <div>
      {/* Show Navbar only for dashboard pages */}
      <Navbar
        menus={partner_topbar}
        showSearchBar={false}
        IconName={seller_icons}
        IconSizes={seller_icons_sizes}
        Iconslabel={false}
        path={logo}
      />
      <Outlet /> {/* This renders the child components (dashboard, catalog, etc.) */}
    </div>
  );
};

export default Layout;
