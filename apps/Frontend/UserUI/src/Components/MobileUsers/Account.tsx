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
import { useState } from "react";

export const Account = () => {
  const isOpen = useSelector((state: any) => state.sidebar.isOpen);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const email = useSelector((state: any) => state.auth.email);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      setloading(true);
      const response = await axios.get(`${backend_url}userAuth/logout`, {
        withCredentials: true,
      });
      console.log(email);
      dispatch(logOut());
      navigate("/users/login");
    } catch (error: any) {
      if (error.response.data.message == "Unauthorized") {
        alert("session expired, please login.")
        dispatch(logOut());
        navigate("/users/login");
      }
    } finally {
      setloading(false);
    }
  };

  const menuItems = [
    {
      label: "Order",
      describe: "Check your order status",
      icon: <Package size={18} />,
      onClick: () => {},
    },
    {
      label: "Collection & Wishlist",
      describe: "All your current product collections",
      icon: <Heart size={18} />,
      onClick: () => {},
    },
    {
      label: "Saved Cards",
      describe: "Save your cards for faster checkouts",
      icon: <CreditCard size={18} />,
      onClick: () => {},
    },
    {
      label: "Saved UPI",
      describe: "View your saved UPI",
      icon: <CreditCard size={18} />,
      onClick: () => {},
    },
    {
      label: "Wallets",
      describe: "View your saved Wallet",
      icon: <CreditCard size={18} />,
      onClick: () => {},
    },
    {
      label: "Address",
      describe: "Save addresses for a hassle-free checkout",
      icon: <MapPin size={18} />,
      onClick: () => {},
    },
    {
      label: "Coupons",
      describe: "Manage coupons for additional discount",
      icon: <Bell size={18} />,
      onClick: () => {},
    },

    {
      label: "Edit Profile",
      describe: "Change your profile details",
      icon: <User size={18} />,
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-50 to-gray-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-25"
          onClick={() => dispatch(closeMenu())}
        />
      )}

      {/* Profile Section */}
      <div className="flex flex-col items-center mt-15 py-9 ">
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
        <p className="font-semibold mt-3 text-[1.3rem]">{email}</p>
      </div>
      {/* Menu Section - Unified Card */}
      <div className="bg-white w-full rounded-tl-3xl rounded-tr-3xl">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-5 py-4 active:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/user/${item.label}`)}
          >
            <div className="flex flex-col">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">{item.icon}</div>
                <span className="text-[1.1rem] font-semibold">
                  {item.label}
                </span>
              </div>

              <div className="pl-8">
                <p className="text-[0.8rem] font-medium text-gray-400">
                  {item.describe}
                </p>
              </div>
            </div>

            <ChevronRight size={18} className="text-gray-400" />
          </div>
        ))}
      </div>
      <div className="box bg-white mt-3 p-5">
        <div className="items flex flex-col justify-center pl-8 gap-4 text-[0.8rem] text-black font-semibold">
          <p>FAQs</p>
          <p>ABOUT US</p>
          <p>TERMS OF USE</p>
          <p>CUSTOMER POLICIES</p>
          <p>USEFUL LINKS</p>
        </div>
      </div>

      {/* login button */}
      <div className="btn bg-gray-50 mt-1">
        <div className=" p-3">
          <Button
            onClick={logout}
            className={`w-full h-[3rem] bg-[#ff3f6ce0] text-md font-semibold ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            disabled={loading}
          >
            LOGOUT
          </Button>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center no-scrollbar">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-2xl border-1 p-1">
            <div className="w-8 h-8 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
};
