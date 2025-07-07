import { logo } from "@/ImagesCollection";
import { logOut } from "@/store/authSlice";
import axios from "axios";
import { backend_url, millisearch_key, millisearch_url } from "../../../config";
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  SquarePlus,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HoverDropdown } from "./HoverDropdown";
import { AnimatePresence } from "framer-motion";

import { useRef} from "react";

import useSWR from "swr";

import { useDebounce, useDebouncedCallback } from "use-debounce";

export const Navbarmobilt = ({ openMenu }: { openMenu?: () => void }) => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  const email = useSelector((state: any) => state.auth.email);

  const dispatch = useDispatch();

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
        alert("session expired, please login.");
        dispatch(logOut());
        navigate("/users/login");
      }
    } finally {
      setloading(false);
    }
  };

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const [query, setquery] = useState("");

  const [debouncing] = useDebounce(query, 700);

  const [item, selecteditem] = useState([]);

  const [showOptions, setShowOptions] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  useEffect(() => {
    if (debouncing.trim()) {
      if (debouncing.length > 2) {
        // alert("Searching for: " + debouncing);
        getDataFromMilli(debouncing);
        setShowOptions(true);
      } else{
        selecteditem([]);
        setShowOptions(false);
      }
    }
    if (query.length == 0) {
      selecteditem([]);
      setShowOptions(false);
    }
  }, [debouncing, query]);

  const getDataFromMilli = async (query: string) => {
    try {
      const response = await axios.post(
        `${millisearch_url}indexes/products/search`,
        {
          q: query,
          filter: "",
        },
        {
          headers: {
            Authorization: `Bearer ${millisearch_key}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("The response from milli", response.data.hits);
      selecteditem(response.data.hits);
      console.log(item);
      // navigate("/search", { state: { item: response.data.hits } });
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleCategoryClick = (category: any) => {
    // alert(category);
    navigate("/categoryPage", { state: { category } });
  };

  const [Navvalues, setNavvales] = useState([
    {key: "MEN", Navitem: "MEN"},
    {key: "WOMEN", Navitem: "WOMEN"},
    {key: "GENZ", Navitem: "GENZ"},
    {key: "KIDS", Navitem: "KIDS"}
  ])

  const fetchData = async (url : any) =>{
    const res = await axios.get(url)
    return res;
  }

  const [itemsList, setitemList] = useState([]);

  const {data: Navdata, error: Naverror, isLoading: NavisLoding} = useSWR("https://cms-7655.onrender.com/api/navbar-stylings?populate=*",fetchData)

  console.log(Navdata?.data.data)

  useEffect(() =>{
    setitemList(Navdata?.data.data)
  },[Navdata])

  useEffect(() =>{
    if(!itemsList) return;

    const itemData = Navvalues.map((val) =>{
      const matched: any = itemsList.find((item: any) => item.NavLabel === val.key)

      if(matched && matched.NavItems){
        return {
          ...val,
          Navitem: matched.NavItems
        }
      }
      return val;
    })

    setNavvales(itemData)
  },[])



  return (
    <header className="shadow-sm bg-white w-full py-3 px-2 lg:py-0 flex items-center justify-between">
      {/* MOBILE NAVBAR */}
      <div className="flex items-center justify-between w-full lg:hidden">
        <div className="flex gap-4 items-center">
          <Menu className="text-xl" onClick={openMenu} />
          <img
            src={logo}
            alt="Logo"
            className="h-7 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex items-center gap-4">
          <SquarePlus className="text-xl" />
          <Heart className="text-xl" onClick={() => navigate("/my/wishlist")} />
          <ShoppingBag className="text-xl" />
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="hidden h-[5rem] lg:px-2 lg:flex items-center justify-between w-full">
        {/* Left section: logo and nav */}
        <div className="flex items-center gap-5 h-full">
          <img
            src={logo}
            alt="Logo"
            className="h-8 cursor-pointer pl-2"
            onClick={() => navigate("/")}
          />

          {/* mobile nav bar */}

          <nav
            className="flex h-full [@media(min-width:1015px)]:text-[0.83rem] [@media(min-width:1399px)]:gap-3 [@media(min-width:1399px)]:text-[0.9rem]
           font-semibold text-gray-700"
          >
            <div
              className=" h-full flex"
              onMouseEnter={() => setHoveredCategory("Men")}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => handleCategoryClick("Men")}
                className={`hover:text-pink-500 cursor-pointer px-2  ${hoveredCategory == "Men" ? "text-pink-500 border-b-3 border-pink-500" : ""}`}
              >

                {Navvalues.find((val) => val.key === "MEN")?.Navitem}
                
              </button>

              {hoveredCategory === "Men" && (
                <HoverDropdown selectedCategory="Men" />
              )}
            </div>

            <div
              className=" h-full flex"
              onMouseEnter={() => setHoveredCategory("WomenEthnic")}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => handleCategoryClick("WomenEthnic")}
                className={`hover:text-pink-500 cursor-pointer px-2 ${hoveredCategory == "WomenEthnic" ? "text-pink-500 border-b-3 border-pink-500" : ""}`}
              >
                {Navvalues.find((val) => val.key === "WOMEN")?.Navitem}
              </button>

              {hoveredCategory === "WomenEthnic" && (
                <HoverDropdown selectedCategory="WomenEthnic" />
              )}
            </div>

            <div
              className=" h-full flex"
              onMouseEnter={() => setHoveredCategory("genz")}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => handleCategoryClick("genz")}
                className={`hover:text-pink-500 cursor-pointer px-2 ${hoveredCategory == "genz" ? "text-pink-500 border-b-3 border-pink-500" : ""}`}
              >
                {Navvalues.find((val) => val.key === "GENZ")?.Navitem}
              </button>

              {hoveredCategory === "genz" && (
                <HoverDropdown selectedCategory="genz" />
              )}
            </div>

            <div
              className=" h-full flex"
              onMouseEnter={() => setHoveredCategory("Kids")}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <button
                onClick={() => handleCategoryClick("Kids")}
                className={`hover:text-pink-500 cursor-pointer px-2 ${hoveredCategory == "Kids" ? "text-pink-500 border-b-3 border-pink-500" : ""}`}
              >
                {Navvalues.find((val) => val.key === "KIDS")?.Navitem}
              </button>

              {hoveredCategory === "Kids" && (
                <HoverDropdown selectedCategory="Kids" />
              )}
            </div>
          </nav>
        </div>

        {/* Middle: Responsive Search Bar larger searchbar*/}
        <div ref={wrapperRef} className="flex flex-grow mx-8 relative">
          <div className="flex flex-grow items-center gap-2 border border-gray-300 rounded-md px-4 py-2">
            <Search className="text-gray-500 w-5 h-5 cursor-pointer" />
            <input
              type="text"
              value={query}
              onChange={(e) => setquery(e.target.value)}
              placeholder="Search for products, brands and more"
              spellCheck="false"
              className="w-full outline-none bg-transparent text-lg pl-2"
            />
          </div>
          {showOptions && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded z-50 border border-gray-200 max-h-[360px] overflow-hidden">
              <div className="px-4 py-2 font-semibold text-gray-700 bg-gray-100">
                All Others
              </div>
              {item?.map((data: any, index) => (
                <div
                  key={data?.id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-md text-gray-700"
                  onClick={() => {
                    // setSearchTerm(`${item.brand} ${item.gender} ${item.category || ''}`);
                    // setShowDropdown(false);
                    // alert(data.attributes["Usage"])
                    setquery("")
                    navigate(`/user/Products/${data.name}`, {state: {Gender : data.attributes["Gender"]}})
                  }}
                >
                  {data.name} {data.attributes["Product Title"]} For{" "}
                  {data.attributes.Gender}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right section: icons */}
        <div className="flex gap-6 items-center  text-gray-700 text-sm font-medium [@media(min-width:1015px)]:text-[0.7rem] [@media(min-width:1399px)]:text-[0.9rem]">
          <button onClick={() => navigate("/sellerPage")} className="hover:text-pink-500 cursor-pointer [@media(min-width:1399px)]:text-[0.95rem] [@media(min-width:1015px)]:text-[0.86rem]">
            Become a Supplier
          </button>
          <div className="relative group hidden lg:flex flex-col items-center cursor-pointer">
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-pink-500 transition">
              Profile
            </span>

            {/* Dropdown menu with animation */}
            <div
              className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-500 delay-300 ease-in-out
    absolute top-10 right-[-0.5] w-[260px] bg-white shadow-xl border rounded z-50 pointer-events-none group-hover:pointer-events-auto"
            >
              <div className="p-4 border-b">
                <p className="text-sm font-semibold">
                  {email ? "Hello there," : "Welcome"}
                </p>
                <p className="text-xs text-gray-500">
                  {!email && "To access account and manage orders"}
                </p>
                {email ? (
                  <p className="pt-1">{email}</p>
                ) : (
                  <button
                    onClick={() => navigate("/users/login")}
                    className="mt-2 cursor-pointer w-full border border-pink-500 text-pink-500 font-bold py-1 text-sm rounded hover:bg-pink-50"
                  >
                    LOGIN / SIGNUP
                  </button>
                )}
              </div>
              <ul className="text-sm py-2">
                <li
                  onClick={() => navigate("/user/my/orders")}
                  className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  Orders
                </li>
                <li
                  onClick={() => navigate("my/wishlist")}
                  className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  Wishlist
                </li>
                <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                  Contact Us
                </li>
                <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer flex justify-between items-center">
                  Mynstars Insider
                  <span className="bg-pink-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-2">
                    NEW
                  </span>
                </li>
              </ul>
              <hr />
              <ul className="text-sm py-2">
                <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                  Saved Cards
                </li>
                <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                  Saved VPA
                </li>
                <li
                  onClick={() => navigate("/user/my/address")}
                  className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                >
                  Saved Addresses
                </li>
              </ul>
              <hr />
              {email && (
                <ul className="text-sm py-2">
                  <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                    <button
                      className="cursor-pointer"
                      onClick={() => navigate("/user/profile/edit")}
                    >
                      Edit Profile
                    </button>
                  </li>
                  <li className="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                    <button
                      className={`${loading ? "cursor-not-allowed" : "cursor-pointer"} `}
                      disabled={loading}
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate("/my/wishlist")}
          >
            <Heart className="w-5 h-5 mb-0.5" />
            <span className="hover:text-pink-500">Wishlist</span>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate("/checkout/cart")}
          >
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="hover:text-pink-500">Bag</span>
          </div>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl border-1 p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </header>
  );
};
