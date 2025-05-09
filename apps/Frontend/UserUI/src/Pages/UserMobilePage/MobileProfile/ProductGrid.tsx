import ProductItem from "@/Components/MobileUsers/ProductItems";
import ProductCard from "@/Components/ProductAdmin/ProductCard";
import {
  p1,
  p10,
  p11,
  p12,
  p13,
  p14,
  p15,
  p16,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  photo1,
} from "@/ImagesCollection";
import React, { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import MobileFilterSortBar from "@/Components/MobileUsers/MobileFilterSortBar";
import MobileFilterModal from "@/Components/MobileUsers/MobileFilterModal";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductsByCategory } from "@/Utiles/api";

interface Product {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  images: string[];
  id: number;
}

// const products: Product[] = [
//   {
//     name: "Classic Denim Jacket",
//     brand: "WOOSTRO",
//     price: 1299,
//     originalPrice: 2599,
//     discount: "50% OFF",
//     images: [p1, p2, p3],
//   },
//   {
//     name: "Slim Fit T-Shirt",
//     brand: "Roadster",
//     price: 499,
//     originalPrice: 999,
//     discount: "50% OFF",
//     images: [p5, p4, p6],
//   },
//   {
//     name: "Casual Checked Shirt",
//     brand: "HIGHLANDER",
//     price: 899,
//     originalPrice: 1799,
//     discount: "50% OFF",
//     images: [p7, p8],
//   },
//   {
//     name: "Formal Blue Shirt",
//     brand: "Van Heusen",
//     price: 1099,
//     originalPrice: 2199,
//     discount: "50% OFF",
//     images: [p9, p10],
//   },
//   {
//     name: "Men’s Chino Pants",
//     brand: "WOOSTRO",
//     price: 1399,
//     originalPrice: 2799,
//     discount: "50% OFF",
//     images: [p11, p12],
//   },
//   {
//     name: "Printed Casual Tee",
//     brand: "Roadster",
//     price: 699,
//     originalPrice: 1399,
//     discount: "50% OFF",
//     images: [p13, p14],
//   },
//   {
//     name: "Printed Tee",
//     brand: "Roadster",
//     price: 499,
//     originalPrice: 1199,
//     discount: "50% OFF",
//     images: [p15, p16],
//   },
//   {
//     name: "Classic Denim Jacket",
//     brand: "WOOSTRO",
//     price: 1299,
//     originalPrice: 2599,
//     discount: "50% OFF",
//     images: [p1, p2, p3],
//   },
//   {
//     name: "Slim Fit T-Shirt",
//     brand: "Roadster",
//     price: 499,
//     originalPrice: 999,
//     discount: "50% OFF",
//     images: [p5, p4, p6],
//   },
//   {
//     name: "Casual Checked Shirt",
//     brand: "HIGHLANDER",
//     price: 899,
//     originalPrice: 1799,
//     discount: "50% OFF",
//     images: [p7, p8],
//   },
//   {
//     name: "Formal Blue Shirt",
//     brand: "Van Heusen",
//     price: 1099,
//     originalPrice: 2199,
//     discount: "50% OFF",
//     images: [p9, p10],
//   },
//   {
//     name: "Men’s Chino Pants",
//     brand: "WOOSTRO",
//     price: 1399,
//     originalPrice: 2799,
//     discount: "50% OFF",
//     images: [p11, p12],
//   },
//   {
//     name: "Printed Casual Tee",
//     brand: "Roadster",
//     price: 699,
//     originalPrice: 1399,
//     discount: "50% OFF",
//     images: [p13, p14],
//   },
//   {
//     name: "Printed Tee",
//     brand: "Roadster",
//     price: 499,
//     originalPrice: 1199,
//     discount: "50% OFF",
//     images: [p15, p16],
//   },
// ];

export default function ProductGrid() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [tempMaxPrice, setTempMaxPrice] = useState(10000);
  const [maxPrice, setMaxPrice] = useState(10000);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const [sortOption, setSortOption] = useState("recommended");

  const { category } = useParams();
  const [product, setProduct] = useState<Product[]>([]);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    function fetchData() {
      if (category) {
        setloading(true);
        fetchProductsByCategory(decodeURIComponent(category))
          .then((data) => {
            console.log("hi", data)
            const normalized = data.map((item: any) => ({
              ...item,
              images: [item.frontImage, item.backImage].filter(Boolean),
            }));
            setProduct(normalized);
          })
          .catch((error) => {
            if (error.response?.status === 503 && error.response?.data?.retry) {
              console.log("Network error");
              setTimeout(fetchData, 5000);
            }

            console.error(error);
          })
          .finally(() => {
            setloading(false);
          });
      }
    }

    fetchData();
  }, [category]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredProducts = product.filter(
    (product) =>
      (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
      product.price <= maxPrice
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "priceLowToHigh":
        return a.price - b.price;
      case "priceHighToLow":
        return b.price - a.price;
      case "recommended":
      default:
        return 0; // Leave original order
    }
  });

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setTempMaxPrice(10000);
    setMaxPrice(10000);
  };

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen lg:mt-20 md:mt-0 border-t relative">
      {/* Breadcrumbs */}
      <p className="mb-5 absolute top-3 z-10 pl-7 hidden lg:block">
        <span onClick={() => navigate("/")} className="text-[0.8rem] cursor-pointer hover:text-gray-600">Home</span> /{" "}
        <span className="text-[0.8rem]">Clothing</span> /{" "}
        <span className="text-[0.9rem] font-semibold">{category}</span>
      </p>
      <p className="absolute top-11 z-10 pl-7 hidden lg:block">
        <span className="font-semibold text-[0.9rem]">{category}</span> -{" "}
        <span className="text-[0.9rem] text-gray-400">
          {product.length} items
        </span>{" "}
      </p>

      {/* Filter Sidebar */}
      <aside className="w-64 pt-20 md:pt-12 lg:pt-20 bg-white self-start h-fit hidden md:block">
        <div className="border-r p-4">
          <h2 className="text-xl font-semibold p-1 pl-3">Filters</h2>
          <hr />

          <div className="mb-6 mt-5">
            <h3 className="font-medium mb-2">Brand</h3>
            <ul className="space-y-1">
              {["WOOSTRO", "Roadster", "HIGHLANDER", "Van Heusen"].map(
                (brand) => (
                  <li key={brand} className="list-none">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      {brand}
                    </label>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Price</h3>
            <div className="flex justify-between mb-2 text-sm text-gray-700">
              <span>Up to ₹{tempMaxPrice}</span>
            </div>
            <input
              type="range"
              min={100}
              max={10000}
              value={tempMaxPrice}
              onChange={(e) => setTempMaxPrice(Number(e.target.value))}
              onMouseUp={() => setMaxPrice(tempMaxPrice)}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Color</h3>
            <ul className="space-y-1">
              <li>
                <input type="checkbox" /> Blue
              </li>
              <li>
                <input type="checkbox" /> Black
              </li>
              <li>
                <input type="checkbox" /> White
              </li>
              <li>
                <input type="checkbox" /> Grey
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Discount</h3>
            <ul className="space-y-1">
              <li>
                <input type="checkbox" /> 10% and above
              </li>
              <li>
                <input type="checkbox" /> 30% and above
              </li>
              <li>
                <input type="checkbox" /> 50% and above
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white shadow md:hidden">
        <MobileFilterSortBar
          onOpenFilter={() => setShowFilterModal(true)}
          onOpenSort={() => setShowSortModal(true)}
        />
      </div>

      <AnimatePresence>
        {showFilterModal && (
          <MobileFilterModal
            onClose={() => setShowFilterModal(false)}
            onClearAll={clearAllFilters}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            tempMaxPrice={tempMaxPrice}
            setTempMaxPrice={setTempMaxPrice}
            setMaxPrice={setMaxPrice}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSortModal && (
          <>
            {/* Optional backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSortModal(false)}
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-x-0 bottom-0 bg-white z-30 rounded-t-xl shadow-lg h-1/2 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-[#ff3f6ce0]">SORT BY</h2>
                <button onClick={() => setShowSortModal(false)}>Close</button>
              </div>
              <ul className="space-y-2">
                {[
                  { key: "recommended", label: "Recommended", icon: "🔥" },
                  {
                    key: "priceLowToHigh",
                    label: "Price: Low to High",
                    icon: "₹",
                  },
                  {
                    key: "priceHighToLow",
                    label: "Price: High to Low",
                    icon: "₹",
                  },
                ].map((option) => {
                  const isSelected = sortOption === option.key;
                  return (
                    <li key={option.key}>
                      <button
                        onClick={() => {
                          setSortOption(option.key);
                          setShowSortModal(false);
                        }}
                        className={`flex items-center w-full px-3 py-2 text-left transition-all border-l-1
            ${isSelected ? "text-[#ff3f6c] font-semibold  border-l-4 border-[#ff3f6c]" : "text-gray-800"}
            hover:bg-gray-100`}
                      >
                        <span className="text-lg w-6">{option.icon}</span>
                        <span className="ml-2">{option.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product Grid */}
      <main className="flex-1 p-4 bg-white">
        <div className="flex justify-between items-center">
          <div className="lg:pb-20 flex flex-col items-center md:h-0 pb-10 lg:gap-5 lg:h-[6rem]"></div>

          <div className="flex justify-end mb-4 lg:block hidden">
            <select
              className="border px-2 py-1 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="recommended">Sort by: Recommended</option>
              <option value="priceLowToHigh">Price: Low to High</option>
              <option value="priceHighToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap justify-center pb-10 gap-3 md:flex md:flex-wrap md:justify-center lg:justify-start lg:gap-y-10 lg:pl-18">
          <AnimatePresence>
            {sortedProducts.map((item, index) => (
              <motion.div
                key={item.name + index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductItem key={index} item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl border-1 p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}
