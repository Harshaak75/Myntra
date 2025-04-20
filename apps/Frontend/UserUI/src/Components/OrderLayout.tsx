import { Outlet } from "react-router-dom";
import { Navbar2 } from "./Navbar2";
import { SellerSidebar } from "../Pages/SellerPages/Orders/SellerComponents/SellerSidebar";

const OrderLayout  = () => {
  return (
    <div>
      {/* Show Navbar only for dashboard pages */}
      <Navbar2/>
      <SellerSidebar/>
      <Outlet /> {/* This renders the child components (dashboard, catalog, etc.) */}
    </div>
  );
};

export default OrderLayout;