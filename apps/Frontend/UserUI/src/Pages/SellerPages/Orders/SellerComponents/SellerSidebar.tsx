import { Menu } from "lucide-react";
import { logo } from "../../../../ImagesCollection";
import { sidebarValues } from "../SellerData/Sellerdata";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export function SellerSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (title: string) => {
    if(title == "Orders"){
      navigate("/Orders/Search")
    }
    else if(title == "Packing Desk"){
      navigate("/Orders/Packing")
    }
  }

  const getPathfromTitle = (title: string) =>{
    if(title == "Orders"){
      return "/Orders/Search"
    }
    else if(title == "Packing Desk"){
      return "/Orders/Packing"
    }
  }
  return (
    <div className="fixed top-0 left-0 z-50 group hover:w-[15rem] w-[3rem] h-full bg-white text-white transition-all duration-300 ease-in-out overflow-hidden">
      <div className="flex flex-col pt-[12px]">
        {/* If navbar is fixed, offset sidebar content */}
        <div className="flex items-center px-4 gap-5">
          <div className="">
            <Menu className="w-5 h-5 text-black font-bold" />
          </div>
          <div onClick={() => navigate("/seller/dashboard")} className="flex items-center gap-3 cursor-pointer">
            <img
              className="opacity-0 group-hover:opacity-100 w-10 h-10 transition-opacity duration-300 ease-in-out"
              src={logo}
              alt=""
            />
            <p className="opacity-0 group-hover:opacity-100 text-gray-600 text-[1.2rem] font-semibold transition-opacity duration-300 ease-in-out">
              Mynstars
            </p>
          </div>
        </div>
        {/* More sidebar items... */}
        <div className="flex flex-col gap-2 mt-6">
          {sidebarValues.map((values, key) => {
            const Icons = values.logo;
            const targetPath = getPathfromTitle(values.title);
            const activeitem = location.pathname == targetPath;
            return (
              <div
                key={key}
                className={`flex items-center px-4 cursor-pointer ${activeitem ? "bg-gray-50" : ""} hover:bg-gray-50 p-3`}
                onClick={() => handleNavigate(values.title)}
              >
                <div className="">
                  <Icons className="w-5 h-5 text-black font-bold" />
                </div>
                <p className="ml-3 whitespace-nowrap overflow-hidden w-0 group-hover:w-auto group-hover:opacity-100 opacity-0 transition-all duration-300 text-gray-500 text-[1rem] font-semibold">
                  {values.title}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
