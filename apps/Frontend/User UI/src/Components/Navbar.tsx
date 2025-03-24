import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface IconNameType {
  [key: string]: LucideIcon;
}

export default function Navbar({
  menus,
  showSearchBar,
  IconName,
  IconSizes,
  Iconslabel,
  path,
}: {
  menus: string[];
  showSearchBar?: boolean;
  IconName?: IconNameType;
  IconSizes?: Record<string, number>;
  Iconslabel?: boolean;
  path?: string;
}) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Container */}
        <div className="flex items-center justify-between w-full gap-4 flex-wrap md:flex-nowrap p-3">
          {/* Logo */}
          <div className="flex flex-row items-center  pb-2">
            <img src={path} alt="" className="w-[5rem] h-[3rem] object-cover" />
            <div className="text-center leading-tight flex flex-col items-start">
              <div className="font-medium text-gray-500">PARTNER</div>
              <div className="font-medium text-gray-500">PORTAL</div>
            </div>
          </div>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 flex-shrink">
            {menus.map((item) => (
              <a
                key={item}
                href="#"
                className="relative text-gray-500 hover:text-blue-900 group font-medium"
              >
                {item}
                <span className="absolute -bottom-7 shadow left-0 w-0 h-[2.5px] transition-all duration-200 bg-blue-900 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Search Bar (Full-width on Mobile) */}
          {showSearchBar && (
            <div className="hidden md:flex relative flex-grow min-w-[150px] max-w-[350px]">
              <Search
                className="absolute left-3 top-2 text-gray-500"
                size={20}
              />
              <input
                type="text"
                className="bg-[#F5F5F6] w-full p-2 pl-10 rounded border focus:bg-white outline-none border-gray-300"
                placeholder="Search for Products, brands and more"
              />
            </div>
          )}

          {/* Icons (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            {IconName &&
              Object.entries(IconName).map(([key, Icons]) => (
                <a
                  key={key}
                  href="#"
                  className="text-gray-700 hover:text-blue-900 flex items-center gap-2"
                >
                  <Icons size={IconSizes?.[key] || 20} />
                  {Iconslabel && key}
                </a>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu (Appears when toggled) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white p-3 border-t">
            <div className="flex flex-col gap-3">
              {menus.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-red-500"
                >
                  {item}
                </a>
              ))}
              <hr />
              {IconName &&
                Object.entries(IconName).map(([key, Icons]) => (
                  <a
                    key={key}
                    href="#"
                    className="text-gray-700 hover:text-red-500 flex items-center gap-1"
                  >
                    <Icons size={IconSizes?.[key] || 20} /> {Iconslabel && key}
                  </a>
                ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
