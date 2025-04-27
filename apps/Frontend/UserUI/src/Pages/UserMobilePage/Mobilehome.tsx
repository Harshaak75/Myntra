// import { FaBars, FaHeart, FaShoppingBag, FaUser } from "react-icons/fa";
// import { HiOutlinePlus } from "react-icons/hi";
// import { AiOutlineSearch } from "react-icons/ai";

import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  SquarePlus,
  User,
} from "lucide-react";
import { logo } from "../../ImagesCollection";

export function Mobilehome() {
  const categories = [
    "SHIRTS",
    "JEANS",
    "TSHIRTS",
    "CASUAL SHOES",
    "SPORTS SHOES",
    "KURTA SETS",
    "TOPS",
    "KURTAS",
    "JEANS",
  ];

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Top Navbar */}
      <header className="flex items-center justify-between p-4 shadow">
        <div className="flex gap-4 items-center">
          <Menu className="text-xl" />
          <img src={logo} alt="Logo" className="h-7" />
        </div>
        <div className="flex items-center gap-4">
          <SquarePlus className="text-xl" />
          <Heart className="text-xl" />
          <ShoppingBag className="text-xl" />
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4">
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for Categories"
            className="flex-1 outline-none"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Mens  */}
        <div className="overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory scrollbar-hide px-4 space-x-4 mb-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="inline-block w-20 text-center text-[0.7rem] font-semibold snap-start"
            >
              <div className="h-20 w-20 mx-auto mb-1 bg-blue-gradient" />
              {cat}
            </div>
          ))}
        </div>

        {/* Womens */}
        <div className="overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory scrollbar-hide px-4 space-x-4 mb-4">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="inline-block w-20 text-center text-[0.7rem] font-semibold snap-start"
            >
              <div className="h-20 w-20 bg-pink-gradient mx-auto mb-1" />
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* 25% Offer Banner */}

      <div className="relative">
        {/* Left Scalloped Edge */}
        <div className="absolute left-0 top-0 h-full w-6 overflow-hidden">
          <svg
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M10,0 Q0,12.5 10,25 Q0,37.5 10,50 Q0,62.5 10,75 Q0,87.5 10,100"
              fill="#fde4f1"
            />
          </svg>
        </div>

        {/* Right Scalloped Edge */}
        <div className="absolute right-0 top-0 h-full w-6 overflow-hidden rotate-180">
          <svg
            viewBox="0 0 10 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M10,0 Q0,12.5 10,25 Q0,37.5 10,50 Q0,62.5 10,75 Q0,87.5 10,100"
              fill="#f6edff"
            />
          </svg>
        </div>

        {/* Main Ribbon */}
        <div className="bg-gradient-to-r from-[#ffe1e9] via-[#fff0e2] to-[#f6edff] py-4 pl-8 pr-8 ml-6 mr-6 flex justify-between items-center shadow-md">
          <div className="text-[#ff3d6d] font-bold text-base">
            Get 25% Off
            <div className="text-black text-sm font-normal">
              Up To ₹200 Off*
            </div>
          </div>
          <div className="bg-white px-3 py-1 text-black text-sm font-semibold rounded">
            MYNSTARSAVE
          </div>
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
            %
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mt-4 px-4">
        <img
          src="https://assets.myntassets.com/w_560,q_90,image/jpeg,dpr_1.0/assets/images/2023/10/10/1e99f47b-20db-4a00-b8bc-0099f14e3e521696923200165-Dressberry_Hotlist.jpg"
          alt="Featured"
          className="rounded-lg shadow"
        />
        <div className="mt-2 font-semibold text-sm">
          Trendy Tops & Tshirts – Under ₹249 + Free Shipping
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t-[0.04rem] flex justify-around items-center py-2 text-sm">
        <div className="flex flex-col items-center text-pink-600">
          <img src={logo} className="h-5 mb-1" alt="home" />
          Home
        </div>
        <div className="flex flex-col items-center text-gray-600">
          <strong>fwd</strong>
          Under ₹999
        </div>
        <div className="flex flex-col items-center text-gray-600">
          <strong>©️</strong>
          Beauty
        </div>
        <div className="flex flex-col items-center text-gray-600">
          <User />
          Profile
        </div>
      </nav>
    </div>
  );
}
