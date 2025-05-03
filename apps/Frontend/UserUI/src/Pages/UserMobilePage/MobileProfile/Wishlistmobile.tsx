import { ChevronLeft, ShoppingBag } from "lucide-react"; // Or your icon lib
import { useNavigate } from "react-router-dom";
// import productImage from "../assets/product.jpg"; // replace with actual image path

export const Wishlistmobile = () => {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Navbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-5">
          <ChevronLeft className="text-gray-800"  onClick={() => navigate("/user/account")}/>
          <div className="font-semibold text-gray-800">
            <p className="text-[1.2rem] text-gray-700">Wishlist</p>
            <p className="text-[0.8rem] text-gray-500">3 items</p>
          </div>
        </div>
        <div className="relative">
          <ShoppingBag className="text-gray-800" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
            1
          </span>
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="p-1 flex flex-wrap items-center gap-2">

        <div className="border rounded-md overflow-hidden w-[12.4rem] h-[23.8rem] ">
          <div className="relative">
            <img
              src="https://uspoloassn.in/cdn/shop/files/1_0be10667-dd93-44f9-a31b-5cff7dde52db.jpg"
              alt="wishlist item"
              className="w-full h-[16.4rem] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
              ✖
            </button>
          </div>
          <div className="p-2">
            <p className="font-semibold text-gray-800 text-[0.9rem]">U.S. Polo Assn</p>
            <div className="flex items-center gap-2 ">
              <p className="text-gray-800 font-bold mt-1 text-[0.9rem]">₹ 1049</p>
              <p className="text-sm text-gray-500 line-through mt-1 text-[0.8rem]">₹ 1499</p>
              <p className="text-sm text-red-600 font-semibold mt-1 text-[0.8rem]">(30% OFF)</p>
            </div>
            <hr className="mt-3"/>
            <button className="mt-2 w-full text-red-400 py-1 rounded-md text-sm font-bold">
              MOVE TO BAG
            </button>
          </div>
        </div>


        <div className="border rounded-md overflow-hidden w-[12.4rem] h-[23.8rem]">
          <div className="relative">
            <img
              src="https://assets.ajio.com/medias/sys_master/root/20240701/PkvD/6682592c6f60443f31115ea5/-473Wx593H-463034853-green-MODEL.jpg"
              alt="wishlist item"
              className="w-full h-[16.4rem] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
              ✖
            </button>
          </div>
          <div className="p-2">
            <p className="font-semibold text-gray-800 text-[0.9rem]">MAX</p>
            <div className="flex items-center gap-2 ">
              <p className="text-gray-800 font-bold mt-1 text-[0.9rem]">₹ 1049</p>
              <p className="text-sm text-gray-500 line-through mt-1 text-[0.8rem]">₹ 1499</p>
              <p className="text-sm text-red-600 font-semibold mt-1 text-[0.8rem]">(30% OFF)</p>
            </div>
            <hr className="mt-3"/>
            <button className="mt-2 w-full text-red-400 py-1 rounded-md text-sm font-bold">
              MOVE TO BAG
            </button>
          </div>
        </div>


        <div className="border rounded-md overflow-hidden w-[12.4rem] h-[23.8rem]">
          <div className="relative">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwjjvKORCQKVnhMuRkgYn5jhr2gR-4ybZ9-Q&s"
              alt="wishlist item"
              className="w-full h-[16.4rem] object-cover"
            />
            <button className="absolute top-2 right-2 bg-white p-1 rounded-full shadow">
              ✖
            </button>
          </div>
          <div className="p-2">
            <p className="font-semibold text-gray-800 text-[0.9rem]">Allen Solly</p>
            <div className="flex items-center gap-2 ">
              <p className="text-gray-800 font-bold mt-1 text-[0.9rem]">₹ 1049</p>
              <p className="text-sm text-gray-500 line-through mt-1 text-[0.8rem]">₹ 1499</p>
              <p className="text-sm text-red-600 font-semibold mt-1 text-[0.8rem]">(30% OFF)</p>
            </div>
            <hr className="mt-3"/>
            <button className="mt-2 w-full text-red-400 py-1 rounded-md text-sm font-bold">
              MOVE TO BAG
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};
