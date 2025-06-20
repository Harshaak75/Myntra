import { Menu, Search, LucideIcon, User } from "lucide-react";
import { useRef, useState } from "react";
import DropdownMenu from "./DropdownMenu";

import { menuDropdowns } from "../data/SellerMenu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url } from "../../config";

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

  const [activeMenu, setActiveMenu] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0, top: 0 });
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [account, setaccount] = useState(false);
  const [ProfileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const navRef = useRef(null);

  const navigate = useNavigate();

  const [loading, setloading] = useState(false);

  const handleMouseEnter = (event: any, item: any) => {
    if (!menuDropdowns[item]) {
      return;
    }

    const rect = event.target.getBoundingClientRect();
    setDropdownPosition({ left: rect.left, top: rect.bottom });
    setActiveMenu(item);
    setIsDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownVisible(false);
  };

  const handleMenuClick = (item: string) => {
    if (item == "Home") {
      console.log("home");
      navigate("/seller/dashboard");
    }
    return;
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter1 = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current); // Cancel any pending close
    setaccount(true);
  };

  const handleMouseLeave1 = () => {
    timeoutRef.current = setTimeout(() => {
      setaccount(false);
    }, 500); // Delay closing by 500ms
  };

  const handlelogout = async () => {
    try {
      setloading(true)
      await axios
        .get(`${backend_url}seller/logoutSeller`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log("The responsive", response);
          localStorage.removeItem("authorization"); // Clear token
          localStorage.removeItem("email"); // Clear email
          navigate("/seller/signin");
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              console.warn("Session expired. Redirecting to login.");
              localStorage.removeItem("authorization"); // Clear token
              localStorage.removeItem("email"); // Clear email
              navigate("/seller/signin");
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
    finally{
      setloading(false)
    }
  };

  return (
    <nav ref={navRef} className="relative bg-white shadow-md w-full">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar Container */}
        <div className="flex items-center justify-between w-full gap-4 flex-wrap md:flex-nowrap">
          {/* Logo */}
          <div className="flex flex-row items-center  pb-2">
            <img
              src={path}
              alt=""
              className="w-[3.5rem] h-[3.5rem] object-cover"
            />
            <div className="text-center leading-tight flex flex-col items-start pl-2">
              <div className="font-medium text-gray-500">PARTNER</div>
              <div className="font-medium text-gray-500">PORTAL</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 flex-shrink h-20 overflow-hidden">
            {menus.map((item) => (
              <div className="h-full flex">
                <a
                  key={item}
                  className="relative text-gray-500  hover:text-blue-900 group font-medium flex items-center cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleMenuClick(item)}
                >
                  {item}
                  <span className="absolute bottom-0 shadow left-0 w-0 h-[2.5px] transition-all duration-200 bg-blue-900 group-hover:w-full"></span>
                </a>
              </div>
            ))}
          </div>

          {/* Desktop Menu (Hidden on Mobile) */}

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
            {/* Wrapper div that includes both User icon and Dropdown */}
            <div
              className="relative z-30"
              onClick={() => setaccount(true)}
              onMouseEnter={handleMouseEnter1} // Keep dropdown open when hovering
              onMouseLeave={handleMouseLeave1} // Delay close when leaving
            >
              <User
                size={24}
                className="text-gray-700 hover:text-blue-900 cursor-pointer"
              />

              {account && (
                <div className="absolute right-0 mt-1 w-48 bg-white shadow-lg rounded-md border transition-all duration-500 delay-100 border-gray-200">
                  <div className="p-2 font-bold text-gray-800 border-b">
                    My Account
                  </div>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/accountDetails");
                      setaccount(false);
                    }}
                  >
                    Account Details
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      navigate("/manage-shop");
                      setaccount(false);
                    }}
                  >
                    Manage Shop
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-red-500 cursor-pointer"
                    onClick={() => {
                      handlelogout();
                      setaccount(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
                      <Icons size={IconSizes?.[key] || 20} />{" "}
                      {Iconslabel && key}
                    </a>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-70">
          <div className="loader"></div>
        </div>
      )}

      <DropdownMenu
        isVisible={isDropdownVisible}
        content={menuDropdowns[activeMenu]}
        position={dropdownPosition}
        onMouseEnter={() => setIsDropdownVisible(true)}
        onMouseLeave={handleMouseLeave}
      />
    </nav>
  );
}
