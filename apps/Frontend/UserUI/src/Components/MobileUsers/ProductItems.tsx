import axios from "axios";
import { Heart, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import ProductHeart from "./ProductHeart";
import { useNavigate } from "react-router-dom";
import useIsMobile from "@/Hooks/useIsMobile";

interface Product {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  images: string[];
  id: number;
}

const ProductItem = ({ item }: { item: Product }) => {
  console.log("first", item.images);
  const validImages = item.images.filter((img) => {
    // if(img && img != " "){
    //   return img;
    // }

    return img && img != " " ? img : "";
  }); // filter out empty/invalid strings
  const [imageIndex, setImageIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  const [wishlist, setWishlist] = useState(false); // wishlist toggle

  const navigate = useNavigate();

  const slugify = (name: any) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hovering && validImages.length > 1) {
      interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % validImages.length);
      }, 2000);
    } else {
      setImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [hovering, validImages]);

  console.log("images", validImages);

  const isMobile = useIsMobile();
  const handleClick = () => {
    const url = `/cart/${slugify(item.name)}/${item.id}`;
    if (isMobile) {
      // Open in same tab
      window.location.href = url;
    } else {
      // Open in new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div
      className="p-2 relative
      w-[8.5rem] h-[17rem] 
      sm:w-[10.3rem] sm:h-[19rem]
      md:w-[9.2rem] md:h-[18rem]
      lg:w-[13rem] lg:h-[20rem]
      xl:w-[14rem] xl:h-[22rem]
      2xl:w-[15rem] 2xl:h-[23rem]"
    >
      <div
        className="rounded lg:p-2 p-0 transition md:w-full md:h-full cursor-pointer"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <ProductHeart item={item} />

        {/* Image container */}
        <div
          className="overflow-hidden relative bg-gray-200 mb-2 cursor-pointer
          w-[7.5rem] h-[11rem]
          sm:w-[9rem] sm:h-[12rem]
          md:w-[8.2rem] md:h-[12rem]
          lg:w-[10.5rem] lg:h-[15rem]
          xl:w-[11.5rem] xl:h-[17rem]
          2xl:w-[12.5rem] 2xl:h-[18rem]"
        >
          {validImages.length > 1 ? (
            <div
              className="flex transition-transform duration-700 ease-in-out h-full w-full"
              style={{
                width: `${validImages.length * 120}%`,
                transform: `translateX(-${
                  imageIndex * (100 / validImages.length)
                }%)`,
              }}
            >
              {validImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onClick={handleClick}
                />
              ))}
            </div>
          ) : validImages.length === 1 ? (
            <img
              src={validImages[0]}
              alt={item.name}
              className="w-full h-full object-cover"
              onClick={handleClick}
            />
          ) : null}
        </div>

        {/* Product info */}
        <div
          onClick={() =>
            window.open(`/cart/${slugify(item.name)}/${item.id}`, "_blank")
          }
          className="px-2"
        >
          <h4 className="font-semibold text-[0.85rem] md:text-base lg:text-base truncate">
            {item.name}
          </h4>
          <p className="lg:text-xs text-[0.7rem] text-gray-600">{item.brand}</p>
          <div className="flex items-center gap-1 flex-wrap">
            <p className="lg:text-sm text-[0.87rem] font-bold text-gray-700">
              Rs. {item.price}
            </p>
            <p className="text-xs line-through text-gray-400">
              Rs. {item.originalPrice}
            </p>
            <p className="text-red-500 text-[0.7rem] lg:text-[0.8rem] md:text-[0.7rem]">
              {item.discount}
            </p>
          </div>
        </div>

        <div className="absolute lg:bottom-18 lg:left-5 lg:w-[5.5rem] bottom-24 left-3 w-[4.5rem] h-[1.5rem] items-center bg-[rgba(255,255,255,0.7)] flex">
          <div className="flex items-center lg:p-2">
            <p className="lg:text-[0.8rem] text-[0.78rem] font-semibold pl-[0.3rem]">
              4.3
            </p>{" "}
            <Star className="lg:h-[0.8rem] h-[0.78rem] fill-green-800 text-green-800" />
            <div className="border-l-2 h-[1.3rem] lg:ml-1 ml-0 border-black"></div>
          </div>
          <div className="">
            <p className="lg:text-[0.8rem] text-[0.78rem] lg:pl-0 pl-1 font-semibold">
              59
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
