import useIsMobile from "@/Hooks/useIsMobile";
import React from "react";
// import { Product } from '@/data/products';

// interface ProductCardProps {
//   product: Product;
// }

type Item = {
  id: number;
  name: string;
  price: string;
  title?: string;
  image?: string;
  discount?: number;
  originalPrice?: number;
  rating?: number;
  ratingCount?: number;
  brand?: string;
  attributes: {
    [key: string]: any;
  };
};

type Props = {
  item: Item;
};

const ProductCard = ({ item }: Props) => {
  const discount = 55;
  const finalPrice = Math.ceil(
    Number(item.price) - (Number(item.price) * discount) / 100
  );

  const slugify = (name: any) =>
    name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

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
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className="overflow-hidden rounded-sm mb-2 relative h-[300px] w-full">
        <img
          src={item.attributes?.["Front Image"]}
          alt={item.attributes?.["Product Title"]}
          className=" w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
        {item.discount && (
          <span className="absolute bottom-2 right-2 bg-[#ff3f6c] text-white text-xs py-1 px-2 rounded">
            {item.discount}% OFF
          </span>
        )}
      </div>

      <div className="p-2">
        <h3 className="font-medium text-[#282c3f] truncate">{item.name}</h3>
        <p className="text-sm text-[#535766] truncate">
          {item.attributes?.["Product Title"]}
        </p>
        <div className="flex items-center mt-1">
          <span className="font-medium">₹{finalPrice}</span>
          {item.price && (
            <>
              <span className="text-[#535766] line-through text-xs ml-2">
                ₹{item.price}
              </span>
              <span className="text-[#14cda8] text-xs ml-2">
                {discount}% off
              </span>
            </>
          )}
        </div>

        {item.rating && (
          <div className="flex items-center mt-1 text-xs">
            <span className="bg-[#14cda8] text-white px-1 py-0.5 rounded flex items-center">
              {item.rating} ★
            </span>
            <span className="text-[#535766] ml-1">({item.ratingCount})</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
