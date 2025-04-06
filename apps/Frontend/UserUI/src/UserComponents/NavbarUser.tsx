import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { d1, d2, d4, genz, logo, trend } from "../ImagesCollection";
import { useEffect, useRef, useState } from "react";
import { NavbarMenu } from "./NavbarMenu";
import { AnimatePresence, motion } from "framer-motion";

export function NavbarUser() {
  const [input, setinput] = useState("");
  const [focus, setfocus] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const images = [d1, d2, d4];
  const [index, setindex] = useState(0);
  const rotatingSuggestions = ["Relationship", "Clothing", "Brands", "Trends"];
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % rotatingSuggestions.length);
      setindex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const randomSuggestion = rotatingSuggestions[suggestionIndex];

  const handleMouseEnter = () => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    setShowPopup(true);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    timeoutRef.current = window.setTimeout(() => {
      setShowPopup(false);
    }, 300);
  };

  if (timeoutRef.current !== null) {
    clearTimeout(timeoutRef.current);
  }

  return (
    <>
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-8xl p-3 mx-auto">
          <div className="flex items-center justify-between w-full">
            {/* Left side */}
            <div className="flex items-center gap-2 pl-4">
              <img src={logo} alt="Logo" className="w-[2rem] h-[2rem]" />

              {/* Hamburger icon on mobile */}
              <motion.button
                className="md:hidden ml-4 w-8 h-8 relative flex flex-col items-center justify-center"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                aria-label="Toggle Menu"
              >
                <motion.span
                  className="block w-6 h-0.5 bg-black rounded origin-center"
                  animate={
                    mobileMenuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: -6 }
                  }
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-black rounded origin-center my-[2px]"
                  animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-6 h-0.5 bg-black rounded origin-center"
                  animate={
                    mobileMenuOpen
                      ? { rotate: -45, y: -6 }
                      : { rotate: 0, y: 6 }
                  }
                  transition={{ duration: 0.3 }}
                />
              </motion.button>

              {/* Search bar (desktop only) */}
              <div
                className="hidden md:flex min-w-[648px] p-[0.1rem] rounded-2xl relative ml-6"
                style={{
                  background:
                    "linear-gradient(90deg, #ff9966, #ff5e62, #ff3d7b, #f70cff)",
                }}
              >
                <label htmlFor="search-input" className="sr-only">
                  Search
                </label>
                <div className="relative flex-1">
                  {!focus && !input && (
                    <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none z-10 animate-float">
                      <span className="text-black">Search</span>{" "}
                      {randomSuggestion}
                    </span>
                  )}
                  <input
                    type="text"
                    id="search-input"
                    value={input}
                    onChange={(e) => setinput(e.target.value)}
                    onFocus={() => setfocus(true)}
                    onBlur={() => setfocus(false)}
                    autoComplete="off"
                    autoCorrect="off"
                    className="w-full h-[40px] bg-[white] rounded-tl-2xl rounded-bl-2xl outline-none pl-5 pr-4 z-9 relative placeholder-transparent"
                  />
                </div>
                <button
                  className="w-[4rem] rounded-br-2xl rounded-tr-2xl pl-5 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(-90deg, #ff9966, #ff5e62, #ff3d7b, #f70cff)",
                  }}
                >
                  <Search size={20} />
                </button>
              </div>

              {/* Trend & GenZ icons (desktop only) */}
              <div className="hidden md:flex gap-2 ml-4">
                {[trend, genz].map((icon, idx) => (
                  <div
                    key={idx}
                    className="w-[4.2rem] h-[2.5rem] p-[0.1rem] rounded-xl cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(-90deg, #ff9966, #ff5e62, #ff3d7b, #f70cff)",
                    }}
                  >
                    <div className="w-full bg-white h-full rounded-xl flex items-center justify-center">
                      <img src={icon} alt="" className="w-[3rem]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Desktop */}
            <div className="hidden md:flex items-center gap-10 pr-5">
              <div
                className="cursor-pointer"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="text-md">Fast Delivery</div>
                <div className="text-sm text-[#FF3F6C] font-semibold">
                  Enter Pincode
                </div>
              </div>

              {showPopup && (
                <div
                  className={`absolute right-20 top-12 delay-100 transition-all duration-500 mt-2 w-80 bg-white p-5 rounded-bl-lg rounded-br-lg shadow-bl-2xl  z-50 ${isHovered ? "unwrap" : "wrap"}`}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <h3 className="font-semibold text-lg text-center">
                    Your PIN Code unlocks
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    Fastest delivery date, 24/7 Customer Support and Easy
                    Return!
                  </p>
                  <div className="flex flex-col items-center mt-4">
                    <div className="relative w-[9rem] h-[9rem] overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={`carousel-${index}`}
                          src={images[index]}
                          alt={`Image ${index + 1}`}
                          className="absolute w-full h-full object-contain opacity-40 rounded"
                          initial={{ x: -100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 100, opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                            mass: 1.5,
                          }}
                        />
                      </AnimatePresence>
                    </div>
                    <span className="text-[#FF3F6C] text-sm font-semibold mt-2">
                      Fast Delivery
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center border p-3 rounded-lg cursor-pointer">
                    <span className="text-gray-700 text-sm flex items-center gap-2">
                      🔍 Enter Pincode
                    </span>
                    <span className="text-[#FF3F6C] font-semibold text-sm">
                      CHANGE
                    </span>
                  </div>
                </div>
              )}

              <User />
              <Heart />
              <ShoppingCart />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden px-6 py-4 space-y-6 border-t bg-white"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-start space-y-1">
                <span className="text-md">Fast Delivery</span>
                <span className="text-sm text-[#FF3F6C] font-semibold">
                  Enter Pincode
                </span>
              </div>
              <div className="flex gap-6">
                <User />
                <Heart />
                <ShoppingCart />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <NavbarMenu />
    </>
  );
}
