import { logo } from "@/ImagesCollection";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  SquarePlus,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Navbarmobilt = ({ openMenu }: { openMenu?: () => void }) => {
  const navigate = useNavigate();

  return (
    <header className="shadow-sm bg-white w-full px-4 lg:py-5 py-3 flex items-center justify-between">
      {/* MOBILE NAVBAR */}
      <div className="flex items-center justify-between w-full lg:hidden">
        <div className="flex gap-4 items-center">
          <Menu className="text-xl" onClick={openMenu} />
          <img
            src={logo}
            alt="Logo"
            className="h-7 cursor-pointer"
            onClick={() => navigate("/mobile/home")}
          />
        </div>
        <div className="flex items-center gap-4">
          <SquarePlus className="text-xl" />
          <Heart className="text-xl" />
          <ShoppingBag className="text-xl" />
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="hidden lg:flex items-center justify-between w-full">
        {/* Left section: logo and nav */}
        <div className="flex items-center gap-8">
          <img
            src={logo}
            alt="Logo"
            className="h-8 cursor-pointer pl-5"
            onClick={() => navigate("/")}
          />

          <nav className="flex gap-6 [@media(min-width:1015px)]:text-[0.71rem] [@media(min-width:1399px)]:text-[0.9rem]
           font-semibold text-gray-700">
            <button className="hover:text-pink-500">MEN</button>
            <button className="hover:text-pink-500">WOMEN</button>
            <button className="hover:text-pink-500">KIDS</button>
            <button className="hover:text-pink-500">HOME & LIVING</button>
            <button className="hover:text-pink-500">BEAUTY</button>
            <button className="hover:text-pink-500">STUDIO</button>
          </nav>
        </div>

        {/* Middle: Responsive Search Bar */}
        <div className="flex flex-grow mx-8">
          <div className="flex flex-grow items-center gap-2 border border-gray-300 rounded-xl px-4 py-2">
            <Search className="text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="w-full outline-none bg-transparent text-sm"
            />
          </div>
        </div>

        {/* Right section: icons */}
        <div className="flex gap-6 items-center text-gray-700 text-sm font-medium [@media(min-width:1015px)]:text-[0.7rem] [@media(min-width:1399px)]:text-[0.9rem]">
          <div className="flex flex-col items-center hover:text-pink-500">
            <User className="w-5 h-5 mb-0.5" />
            Profile
          </div>
          <div className="flex flex-col items-center hover:text-pink-500">
            <Heart className="w-5 h-5 mb-0.5" />
            Wishlist
          </div>
          <div className="flex flex-col items-center hover:text-pink-500">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            Bag
          </div>
        </div>
      </div>
    </header>
  );
};
