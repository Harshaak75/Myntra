import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "@/store/SidebarSlice";
import { logOut } from "@/store/authSlice";
import {
  User,
  MapPin,
  Heart,
  Package,
  Bell,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { logo } from "@/ImagesCollection";
import { Button } from "../ui/button";
import axios from "axios";
import { backend_url } from "../../../config";
import { useNavigate } from "react-router-dom";

export const Account = () => {
  const isOpen = useSelector((state: any) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  const email = useSelector((state: any) => state.auth.email)

  const navigate = useNavigate();

  const logout = async() =>{
    try {
      const response = await axios.get(`${backend_url}userAuth/logout`,{withCredentials: true})
      console.log(email)
      dispatch(logOut())
      navigate("/users/login")
    } catch (error) {
      console.log(error)
    }
  }

  const menuItems = [
    { label: "Order", icon: <Package size={18} />, onClick: () => {} },
    {
      label: "Collection & Wishlist",
      icon: <Heart size={18} />,
      onClick: () => {},
    },
    { label: "Saved Cards", icon: <CreditCard size={18} />, onClick: () => {} },
    { label: "Saved UPI", icon: <CreditCard size={18} />, onClick: () => {} },
    { label: "Wallets", icon: <CreditCard size={18} />, onClick: () => {} },
    {
      label: "Address",
      icon: <MapPin size={18} />,
      onClick: () => {},
    },
    { label: "Coupons", icon: <Bell size={18} />, onClick: () => {} },

    { label: "Edit Profile", icon: <User size={18} />, onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-25"
          onClick={() => dispatch(closeMenu())}
        />
      )}

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-18 py-9 bg-white">
        <div className="relative w-28 h-28 mb-2">
          {/* Glowing animated ring */}
          <div className="absolute inset-0 rounded-full animate-pulse ring-4 ring-blue-300 blur-sm"></div>

          {/* Spacer between ring and image */}
          <div className="relative w-full h-full p-1.5 rounded-full bg-white z-10">
            <div className="w-full h-full rounded-full overflow-hidden">
              <img
                src={logo} // Replace with actual profile image
                alt="User"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
        <p className="font-semibold mt-3 text-[1.3rem]">User name</p>
      </div>
      {/* Menu Section - Unified Card */}
      <div className="bg-gray-50 w-full rounded-tl-3xl rounded-tr-3xl">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-5 py-4 active:bg-gray-100 cursor-pointer"
            // onClick={() => alert(item.labe)}
          >
            <div className="flex items-center space-x-3 text-gray-700">
              <div className="text-gray-500">{item.icon}</div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        ))}
      </div>
      <div className="box bg-gray-50 mt-5 p-5">
        <div className="items flex flex-col justify-center pl-8 gap-4 text-[0.8rem] text-gray-500 font-semibold">
          <p>FAQs</p>
          <p>ABOUT US</p>
          <p>TERMS OF USE</p>
          <p>CUSTOMER POLICIES</p>
          <p>USEFUL LINKS</p>
        </div>
      </div>

      {/* login button */}
      <div className="btn bg-gray-50 mt-5">
        <div className=" p-3">
          <Button onClick={logout} className="w-full h-[3rem] bg-[#ff3f6ce0] text-md font-semibold">
            LOGOUT
          </Button>
        </div>
      </div>
    </div>
  );
};
