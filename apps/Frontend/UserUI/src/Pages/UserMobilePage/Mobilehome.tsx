"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useEffect, useRef, useState } from "react";
import {
  CircleCheckBig,
  Heart,
  Menu,
  Package,
  Search,
  ShoppingBag,
  SquarePlus,
  User,
  X,
} from "lucide-react";
import { coin, logo, star } from "../../ImagesCollection";
import { useNavigate } from "react-router-dom";
import { Sidebarmobile } from "@/Components/MobileUsers/Sidebarmobile";
import { Navbarmobilt } from "@/Components/MobileUsers/Navbarmobile";
import { Footermobile } from "@/Components/MobileUsers/Footermobie";
import { useSidebar } from "@/Hooks/SidebarContsxt";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu, openMenu } from "@/store/SidebarSlice";

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

  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "snap",
    slides: { perView: 1, spacing: 10 },
    rubberband: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // const [isOpen, setOpen] = useState(false);

  // const openMenu = () => {
  //   setOpen(true);
  // };

  // const closeMenu = () => {
  //   setOpen(false);
  // };

  // const { isOpen, openMenu, closeMenu } = useSidebar();

  const isOpen = useSelector((state: any) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  const banners = [
    "https://www.karobargain.com/wp-content/uploads/2022/05/Zara-Upcoming-Sales-1.jpg",
    "https://img1.paisawapas.com/images/2022/06/22133523/Allen-Solly-Offers.jpg",
    "https://www.levistrauss.com/wp-content/uploads/2019/10/20191024_Velvetone_Hero.jpeg",
    "https://i.pinimg.com/736x/d7/74/1c/d7741c5294cbcb50f8c137fbd47de8c9.jpg",
  ];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const carousel = scrollRef.current;
        const scrollAmount = 200; // how much to scroll each time

        if (
          carousel.scrollLeft + carousel.clientWidth >=
          carousel.scrollWidth
        ) {
          // At end, go back to start
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Fixed Header (Navbar + Search) */}
      <div className="fixed top-0 left-0 w-full bg-white z-20 shadow">
        {/* navbar */}
        <Navbarmobilt openMenu={() => dispatch(openMenu())} />

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
      </div>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto pt-[140px] pb-[70px]">
        {/* 🔥 pt-[140px] = height of header and search
            🔥 pb-[70px] = height of bottom nav
        */}

        {/* Categories (No change in your design) */}
        <div className="p-4">
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

        {/* Offer Banner (No change in your design) */}
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

        {/* Banner Carousel */}
        <div className="w-full max-w-2xl mt-6 mx-auto px-4">
          <div
            ref={sliderRef}
            className="keen-slider rounded-lg overflow-hidden shadow-lg aspect-[16/9]"
          >
            {banners.map((banner, idx) => (
              <div
                key={idx}
                className="keen-slider__slide flex items-center justify-center transition-transform duration-500 ease-out scale-100 hover:scale-95"
              >
                <img
                  src={banner}
                  alt={`Banner ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-3 space-x-2">
            {banners.map((_, idx) => (
              <div
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
                  currentSlide === idx ? "bg-blue-200" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* banner2 */}

        <div className="border border-gray-50 mt-5"></div>

        {/* offer banner */}

        <div className="relative h-[5.5rem] mx-4 my-3 rounded-2xl bg-gradient-to-r from-green-50 via-blue-50 to-green-50 flex items-center justify-around shadow-md">
          {/* Left Star */}
          <div className="absolute -left-5 top-[0.5rem] transform -translate-y-1/2">
            <img src={star} alt="star" className="w-12 h-12 animate-pulse" />
          </div>

          {/* 100% Original */}
          <div className="flex min-w-[6rem] flex-col items-center">
            <div className="text-md">
              <CircleCheckBig />
            </div>
            <div className="text-[0.9rem] font-semibold mt-2">100%</div>
            <div className="text-xs text-gray-500">Original Products</div>
          </div>

          {/* Free Shipping */}
          <div className="flex items-center flex-col border-l border-gray-300 pl-4">
            <div className="text-xl">
              <Package />
            </div>
            <div className="text-sm font-semibold flex mt-2">Free Shipping</div>
            <div className="text-xs text-gray-500">On All Orders</div>
          </div>

          {/* Easy Returns */}
          <div className="flex flex-col items-center border-l border-gray-300 pl-4">
            <div className="text-2xl">₹</div>
            <div className="text-sm font-semibold ">Easy Returns</div>
            <div className="text-xs text-gray-500">And Refunds</div>
          </div>

          {/* Right Star */}
          <div className="absolute -right-5 top-[5.3rem] transform -translate-y-1/2">
            <img src={star} alt="star" className="w-12 h-12 animate-pulse" />
          </div>
        </div>

        {/* border */}

        <div className="border border-gray-50 mt-5"></div>

        {/* offers */}

        <div className="flex gap-3 p-4 overflow-x-auto">
          {/* Card 1 */}
          <div className="w-[7.5rem] h-[9rem] bg-gradient-to-b border from-white to-pink-100 rounded-3xl p-3 flex flex-col items-center justify-center shadow-md">
            <p className="text-[1rem] text-gray-700 font-medium mb-2">Under</p>
            <div className="flex items-center justify-center">
              <span className="text-pink-500 text-sm font-bold">₹</span>
              <span className="text-pink-500 text-2xl font-extrabold leading-5">
                499
              </span>
            </div>
            <p className="text-[1.02rem] text-gray-800 font-bold mt-1">
              Jewellery
            </p>
            <p className="text-gray-600 text-[1.5rem]">→</p>
          </div>

          {/* Card 2 */}
          <div className="w-[7.5rem] h-[9rem] bg-gradient-to-b border from-white to-pink-100 rounded-3xl p-3 flex flex-col items-center justify-center shadow-md">
            <p className="text-[1rem] text-gray-700 font-medium mb-2">Under</p>
            <div className="flex items-center justify-center">
              <span className="text-green-600 text-sm font-bold">₹</span>
              <span className="text-green-600 text-2xl font-extrabold leading-5">
                99
              </span>
            </div>
            <p className="text-[0.9rem] text-gray-800 font-bold mt-1">Only</p>
            <p className="text-gray-600 text-[1.5rem]">→</p>
          </div>

          {/* Card 3 */}
          <div className="w-[7.5rem] h-[9rem] bg-gradient-to-b border from-white to-pink-100 rounded-3xl p-3 flex flex-col items-center justify-center shadow-md">
            <p className="text-[1rem] text-gray-700 font-medium mb-2">Flat</p>
            <div className="flex items-center justify-center">
              <span className="text-purple-600 text-2xl font-extrabold leading-5">
                80%
              </span>
            </div>
            <p className="text-[0.9rem] text-gray-800 font-bold mt-1">Off</p>
            <p className="text-gray-600 text-[1.5rem]">→</p>
          </div>

          {/* Card 4 */}
          <div className="w-[7.5rem] h-[9rem] bg-gradient-to-b border from-white to-pink-100 rounded-3xl p-3 flex flex-col items-center justify-center shadow-md">
            <p className="text-[0.85rem] text-gray-700 font-medium mb-2">
              Under
            </p>
            <div className="flex items-center justify-center">
              <span className="text-blue-600 text-sm font-bold">₹</span>
              <span className="text-blue-600 text-2xl font-extrabold leading-5">
                499
              </span>
            </div>
            <p className="text-[0.9rem] text-gray-800 font-bold mt-1">Only</p>
            <p className="text-gray-600 text-[1.5rem]">→</p>
          </div>
        </div>

        {/* border */}

        <div className="border border-gray-50 mt-5"></div>

        {/* main product */}

        <div className="mt-3">
          <div className="title flex items-center justify-around">
            <div className="">
              <h1 className="text-[1.5rem] font-semibold">
                Pocket Friendly Bargin!
              </h1>
              <p className="text-gray-500">Where style matches savings</p>
            </div>
            <div className="images w-15 h-15">
              <img src={coin} alt="" />
            </div>
          </div>
          {/* carasoel */}
          <div className="overflow-hidden p-4">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scroll-smooth scrollbar-hide gap-1.5"
            >
              {categories.map((top, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {/* Top Part */}
                  <div className="h-[11rem] w-[9rem] bg-pink-200 flex items-center justify-center text-sm font-bold mb-2">
                    {top}
                  </div>
                  {/* Bottom Part */}
                  <div className="h-[11rem] w-[9rem] bg-blue-200 flex items-center justify-center text-sm font-bold">
                    {categories[idx]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 overflow-y-auto`}
      >
        <Sidebarmobile closeMenu={() => dispatch(closeMenu())} />
      </div>

      {/* Background Overlay when menu open */}
      {isOpen && (
        <div
          className="fixed inset-0 h-full bg-black opacity-50 z-25"
          onClick={() =>dispatch(closeMenu())}
        />
      )}

      {/* Fixed Bottom Nav */}
      <Footermobile />
    </div>
  );
}
