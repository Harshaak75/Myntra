import React, { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
  onClearAll: () => void;
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  tempMaxPrice: number;
  setTempMaxPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
}

const filterCategories = [
  "Gender", "Size", "Price", "Brand", "Color", "Discount Range", "Shirts", "Bundles", "Country of Origin"
];

export default function MobileFilterModal({
  onClose,
  onClearAll,
  selectedBrands,
  onBrandChange,
  tempMaxPrice,
  setTempMaxPrice,
  setMaxPrice,
}: Props) {
  const [activeTab, setActiveTab] = useState("Brand");

  const renderOptions = () => {
    switch (activeTab) {
      case "Brand":
        return (
          <div className="space-y-3">
            {["WOOSTRO", "Roadster", "HIGHLANDER", "Van Heusen"].map((brand) => (
              <label key={brand} className="flex justify-between items-center">
                <span>{brand}</span>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onBrandChange(brand)}
                />
              </label>
            ))}
          </div>
        );
      case "Price":
        return (
          <div>
            <p className="text-sm text-gray-700 mb-2">Up to ₹{tempMaxPrice}</p>
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
        );
      default:
        return <p className="text-gray-400">Options for {activeTab}</p>;
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 bg-white z-40 flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">FILTERS</h2>
          <button className="text-[#ff3f6c] font-semibold" onClick={() => {
            setTempMaxPrice(10000);
            setMaxPrice(10000);
            onBrandChange(""); // simple reset
            onClearAll()
          }}>CLEAR ALL</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          <div className="w-1/3 border-r overflow-y-auto">
            {filterCategories.map((category) => (
              <div
                key={category}
                className={`p-3 cursor-pointer text-sm font-medium ${
                  activeTab === category
                    ? "bg-[#f5f5f6] text-[#ff3f6c] border-l-4 border-[#ff3f6c]"
                    : ""
                }`}
                onClick={() => setActiveTab(category)}
              >
                {category}
              </div>
            ))}
          </div>

          {/* Right Panel */}
          <div className="w-2/3 p-4 overflow-y-auto">{renderOptions()}</div>
        </div>

        <div className="flex justify-between border-t text-sm">
          <button className="w-1/2 py-3 text-gray-600" onClick={onClose}>
            CLOSE
          </button>
          <button
            className="w-1/2 py-3 text-[#ff3f6c] font-semibold border-l"
            onClick={onClose}
          >
            APPLY
          </button>
        </div>
      </motion.div>
    </>
  );
}
