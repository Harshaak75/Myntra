import { Gettoken } from "@/Utiles/Gettoken";
import axios from "axios";
import { backend_url } from "../../../config";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface ProductAttribute {
  attributename: string;
  attributevalue: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  productAttribute: ProductAttribute[];
}

interface WishlistItem {
  id: number;
  product: Product;
}

export default function Wishlists() {
  const [wishlistItems, setwishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = await Gettoken();
      try {
        const response = await axios.get(`${backend_url}user/wishlist`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        setwishlistItems(response.data);
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const onRemove = async (productId: number) => {
    const token = await Gettoken();
    try {
      await axios.post(
        `${backend_url}user/wishlist/toggle`,
        { productId },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setwishlistItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const onMoveToBag = (productId: number) => {
    alert(`Add product ${productId} to cart`);
  };

  return (
    <div className="min-h-screen w-full bg-white">
    <div className="p-6 mt-20">
      <h2 className="text-xl font-semibold mb-4">
        My Wishlist{" "}
        <span className="text-gray-500">({wishlistItems.length} items)</span>
      </h2>

      <div className="flex flex-wrap gap-6">
        {wishlistItems.map((item) => {
          const attributes = item.product.productAttribute || [];
          const frontImage = attributes.find(
            (attr) => attr.attributename === "Front Image"
          )?.attributevalue;

          return (
            <div
              key={item.id}
              className="w-[200px] flex flex-col border rounded shadow-sm bg-white relative overflow-hidden mt-5"
            >
              {/* Remove Button */}
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow z-10 cursor-pointer"
                onClick={() => onRemove(item.product.id)}
              >
                <X size={18} />
              </button>

              {/* Image with consistent height and coverage */}
              <div className="w-full h-[280px] bg-white overflow-hidden">
                {frontImage ? (
                  <img
                    src={frontImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm h-full flex items-center justify-center">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-col items-center text-center p-3">
                <h3 className="text-sm font-medium truncate w-full">
                  {item.product.name}
                </h3>
                <div className="mt-1 text-sm">
                  <span className="font-semibold text-gray-800">
                    Rs. {item.product.price}
                  </span>
                  {item.product.originalPrice && (
                    <>
                      <span className="line-through text-gray-400 text-xs ml-2">
                        Rs. {item.product.originalPrice}
                      </span>
                      <span className="text-red-500 text-xs ml-2">
                        ({item.product.discount} OFF)
                      </span>
                    </>
                  )}
                </div>

                {/* Move to Bag */}
                <button
                  onClick={() => onMoveToBag(item.product.id)}
                  className="mt-3 bg-pink-500 text-white text-sm px-4 py-2 rounded hover:bg-pink-600 cursor-pointer"
                >
                  MOVE TO BAG
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </div>
  );
}
