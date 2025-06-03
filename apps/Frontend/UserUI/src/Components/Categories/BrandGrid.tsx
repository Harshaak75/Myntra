import React from "react";
import {
  brands,
  genzbrands,
  Kidsbrands,
  Mencategories,
  Womenbrands,
} from "@/data/Menproducts";

const BrandGrid = ({ gender }: { gender: string }) => {
  const brand =
    gender === "women"
      ? Womenbrands
      : gender === "kids"
        ? Kidsbrands
        : gender === "genz"
          ? genzbrands
          : brands;
  return (
    <div className="mb-10">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-[#282c3f] text-center">
          TRENDING BRANDS
        </h2>
      </div>
      {gender != "kids" ? (
        <div className="grid grid-cols-2 lg:ml-30 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {brand.map((brand) => (
            <div
              key={brand.id}
              className="overflow-hidden rounded-md cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="">
          <div className="flex gap-5">
            {brand.map((brand) => (
              <div
                key={brand.id}
                className="overflow-hidden rounded-md cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-[12rem]"
                  />
                  <div className="absolute inset-0"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandGrid;
