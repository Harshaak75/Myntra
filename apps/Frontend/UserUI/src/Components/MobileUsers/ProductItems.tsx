import React, { useEffect, useState } from "react";

interface Product {
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: string;
  images: string[];
}

const ProductItem = ({ item }: { item: Product }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hovering && item.images.length > 1) {
      interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % item.images.length);
      }, 2000);
    } else {
      setImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [hovering, item.images]);

  return (
    <div className="p-2 lg:w-auto xl:w-auto md:w-full md:h-[20rem] h-[20rem] w-full">
      <div
        className="rounded lg:p-2 p-0 transition md:w-full md:h-full"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* Responsive image wrapper */}
        <div className="overflow-hidden relative bg-gray-200 mb-2 
          w-[10rem]
          h-[13rem] 
          md:h-[14rem] 
          md:w-[10rem]
          lg:w-[12rem] lg:h-[16rem]">
          <div
            className="flex transition-transform duration-700 ease-in-out h-full w-full"
            style={{
              width: `${item.images.length * 100}%`,
              transform: `translateX(-${
                imageIndex * (100 / item.images.length)
              }%)`,
            }}
          >
            {item.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ))}
          </div>
        </div>

        {/* Responsive text container */}
        <div className="px-2">
          <h4 className="font-semibold text-sm sm:text-sm md:text-base lg:text-base">
            {item.name}
          </h4>
          <p className="text-xs text-gray-600">{item.brand}</p>
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-sm font-bold text-gray-700">Rs. {item.price}</p>
            <p className="text-xs line-through text-gray-400">
              Rs. {item.originalPrice}
            </p>
            <p className="text-red-500 text-sm">{item.discount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
