import { Gettoken } from "@/Utiles/Gettoken";
import axios from "axios";
import { backend_url } from "../../../config";
import { Facebook, Instagram, Twitter, X, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { order, wishlist } from "@/ImagesCollection";
import { Footermobile } from "./Footermobie";
import { MainFooter } from "./MainFooter";
import { useNavigate } from "react-router-dom";

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

  const [loading, setloading] = useState(false);

  const [showSuccess, setshowSuccess] = useState(false);
  const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M"); // default

  const [addedtobag, setaddedtobag] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      setloading(true);
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
      } finally {
        setloading(false);
      }
    };

    fetchWishlist();
  }, []);

  const onRemove = async (productId: number, showToast: boolean = true) => {
    setloading(true);
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

      // ✅ Show "removed" toast only if flag is true
      if (showToast) {
        setshowSuccess(true);
        setTimeout(() => {
          setshowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setloading(false);
    }
  };

  const onMoveToBag = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddtoBag = async () => {
    if (!selectedProduct) return;

    setloading(true);

    const token = await Gettoken();

    try {
      await axios.post(
        `${backend_url}user/cart/add`,
        {
          productId: selectedProduct.id,
          size: selectedSize,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // ✅ Don't show the "removed" toast when moving to bag
      await onRemove(selectedProduct.id, false);

      setaddedtobag(true);
      setTimeout(() => setaddedtobag(false), 2000);

      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to move item to bag:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      <div className="p-6 mt-20 pb-[10rem]">
        <h2 className="text-xl font-semibold mb-4">
          My Wishlist{" "}
          <span className="text-gray-500">
            {wishlistItems.length <= 0 ? "" : `${wishlistItems.length} items`}
          </span>
        </h2>

        <div className="flex flex-wrap gap-6">
          {wishlistItems.map((item) => {
            const attributes = item.product.productAttribute || [];
            const frontImage = attributes.find(
              (attr) => attr.attributename === "Front Image"
            )?.attributevalue;
            const productDescription: any = attributes.find(
              (attr) => attr.attributename === "Product Description"
            )?.attributevalue;

            return (
              <div
                key={item.id}
                className="w-[200px] flex flex-col border rounded shadow-sm bg-white relative overflow-hidden mt-5"
              >
                {/* Remove Button */}
                <button
                  className={`absolute top-2 right-2 bg-white rounded-full p-1 shadow z-10 ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
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
                    {`${item.product.name} ${productDescription}`}
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
                    onClick={() => onMoveToBag(item.product)}
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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-70">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl border-1 p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-10 left-[60rem] transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-slide-in-out z-50">
          Item removed from wishlist
        </div>
      )}

      {addedtobag && (
        <div className="fixed top-10 left-[60rem] transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-slide-in-out z-50">
          Item moved to bag
        </div>
      )}

      {wishlistItems.length === 0 && (
        <div className="w-full h-[80vh] flex justify-center">
          <div className="w-[24rem] flex flex-col items-center text-center p-6">
            {/* Title */}
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              YOUR WISHLIST IS EMPTY
            </h1>

            {/* Subtitle */}
            <p className="text-gray-500 text-sm mb-6">
              Add items that you like to your wishlist. Review them anytime and
              easily move them to the bag.
            </p>

            {/* Image */}
            <div className="w-[6rem] h-[6rem] mb-6">
              <img
                src={wishlist}
                alt="Empty Wishlist"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Button */}
            <button
              className="border border-blue-500 text-blue-600 font-semibold px-6 py-2 rounded hover:bg-blue-50 transition cursor-pointer"
              onClick={() => navigate("/")}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      )}

      <MainFooter />

      {selectedProduct && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
              onClick={() => setSelectedProduct(null)}
            >
              <X />
            </button>

            {/* Product Info */}
            <div className="flex items-start gap-4">
              <img
                src={
                  selectedProduct.productAttribute.find(
                    (a) => a.attributename === "Front Image"
                  )?.attributevalue || ""
                }
                alt="Product"
                className="w-24 h-32 object-cover rounded"
              />

              <div className="flex flex-col">
                <h2 className="font-semibold text-[0.95rem] text-gray-800">
                  {`${selectedProduct.name} ${
                    selectedProduct.productAttribute.find(
                      (a) => a.attributename === "Product Description"
                    )?.attributevalue || ""
                  }`}
                </h2>
                <div className="mt-2">
                  <span className="text-black font-bold text-lg">
                    ₹ {selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <>
                      <span className="line-through text-gray-400 text-sm ml-2">
                        ₹ {selectedProduct.originalPrice}
                      </span>
                      <span className="text-red-500 text-sm ml-2">
                        ({selectedProduct.discount} OFF)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <h3 className="mt-6 mb-2 font-medium text-gray-700">Select Size</h3>
            <div className="flex gap-3 flex-wrap">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "text-gray-700 border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Done Button */}
            <button
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded cursor-pointer"
              onClick={handleAddtoBag}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
