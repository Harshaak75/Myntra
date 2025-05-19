import { logo } from "@/ImagesCollection";
import { ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const NavbarSB = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex items-center justify-between border-b p-5 relative">
      {/* Logo - Always visible, aligned left */}
      <img
        src={logo}
        alt="Logo"
        className="h-8 cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* Step Indicator - Centered on mobile */}
      <div className="absolute ml-[30rem] left-1/2  transform -translate-x-1/2 md:static md:transform-none flex items-center text-sm font-medium">
        <span className={`${location.pathname == "/checkout/cart" ? "text-green-600" : "text-gray-400"}`}>BAG</span>

        <div className="h-0.7 w-20 border-t border-dotted border-black mx-2"></div>

        <span className={` ${location.pathname == "/checkout/address" ? "text-green-600" : "text-gray-400"} `}>ADDRESS</span>

        <div className="h-0.7 w-20 border-t border-dotted border-black mx-2"></div>

        <span className={` ${location.pathname == "/checkout/payment" ? "text-green-600" : "text-gray-400"} `}>PAYMENT</span>
      </div>

      {/* 100% Secure - Hidden on mobile, shown on md+ */}
      <div className="hidden md:flex items-center gap-1 text-green-600 text-sm">
        <ShieldCheck />
        <span>100% SECURE</span>
      </div>
    </div>
  );
};
