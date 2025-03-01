import { Menu, Search, User, Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-semibold">Logo</div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {["MEN", "WOMEN", "KIDS", "HOME & LIVING", "BEAUTY"].map((item) => (
              <a key={item} href="#" className="text-gray-700 hover:text-red-500">
                {item}
              </a>
            ))}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-2 text-gray-500" size={20} />
            <input
              type="text"
              className="bg-[#F5F5F6] w-64 lg:w-96 p-2 pl-10 rounded border focus:bg-white outline-none border-gray-300"
              placeholder="Search for Products, brands and more"
            />
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-gray-700 hover:text-red-500 flex items-center gap-1">
              <User size={20} /> Profile
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500 flex items-center gap-1">
              <Heart size={20} /> Wishlist
            </a>
            <a href="#" className="text-gray-700 hover:text-red-500 flex items-center gap-1">
              <ShoppingBag size={20} /> Bag
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white p-4 border-t">
            <div className="flex flex-col gap-3">
              {["MEN", "WOMEN", "KIDS", "HOME & LIVING", "BEAUTY"].map((item) => (
                <a key={item} href="#" className="text-gray-700 hover:text-red-500">
                  {item}
                </a>
              ))}
              <hr />
              <a href="#" className="text-gray-700 hover:text-red-500 flex items-center gap-1">
                <User size={20} /> Profile
              </a>
              <a href="#" className="text-gray-700 hover:text-red-500 flex items-center gap-1">
                <Heart size={20} /> Wishlist
              </a>
              <a href="#" className="text-gray-700 hover:text-red-500 flex items-center gap-1">
                <ShoppingBag size={20} /> Bag
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
