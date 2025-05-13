import axios from "axios";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { backend_url } from "../../../config";
import { Gettoken } from "@/Utiles/Gettoken";
import { useNavigate } from "react-router-dom";

function ProductHeart({ item, userId }: any) {
  const [wishlist, setWishlist] = useState(false);

  const navigate = useNavigate();

  // Load wishlist status on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = await Gettoken();
      axios
        .get(`${backend_url}user/wishlist/check?productId=${item.id}`, {
          headers: {
            authorization: `bearer ${token}`,
          },
          withCredentials: true,
        })
        .then((res) => {
          setWishlist(res.data.exists); // boolean from backend
        })
        .catch((err) => console.error("Wishlist check error:", err));
    };

    fetchData();
  }, [item.id]);

  const handleToggle = async (e: any) => {
    e.stopPropagation();

    const previousState = wishlist;
    setWishlist(!wishlist);

    const token = await Gettoken();

    try {
      const res = await axios.post(
        `${backend_url}user/wishlist/toggle`,
        {
          productId: item.id,
        },
        {
          headers: {
            authorization: `bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setWishlist(res.data.isWishlisted); // backend should return updated status
    } catch (err: any) {
      console.log("err",err)
      if(err.status == 403 && err.response.data.message === "Invalid token"){
        navigate("/users/login")
      }
      console.error("Wishlist toggle failed:", err);

      setWishlist(previousState);

      // alert("Failed to update wishlist. Please try again.");
    }
  };

  return (
    <div className="absolute top-5 right-7 z-10" onClick={handleToggle}>
      <Heart
        size={20}
        className={`transition-colors duration-300 ${
          wishlist
            ? "fill-red-500 text-red-500"
            : "fill-white text-black stroke-2"
        }`}
      />
    </div>
  );
}

export default ProductHeart;
