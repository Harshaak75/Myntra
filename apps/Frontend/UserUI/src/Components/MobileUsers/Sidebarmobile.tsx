import { User, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface SidebarmobileProps {
  closeMenu?: () => void; // make it optional
}

export const Sidebarmobile = ({ closeMenu }: SidebarmobileProps) => {
  const [open, setOpen] = useState(false);

  //   const closeMenu = () => {
  //     setOpen(false);
  //   };
  const naviage = useNavigate();

  const email = useSelector((state: any) => state.auth.email);

  return (
    <>
      <div className="flex items-start flex-col gap-3 p-4 border-b bg-gray-900 border-gray-700">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2 pl-9">
            {email ? (
              <div className="flex flex-col items-center gap-1">
                <p className="text-[1.2rem] font-semibold text-white">
                  Hey there, 👋
                </p>
                <p className="text-xs text-gray-300 font-semibold">
                  Let’s find your look today!
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-gray-700 p-2 rounded-full">
                  <User className="text-white" />
                </div>
                <div onClick={() => naviage("/users/login")}>
                  <p className="text-sm font-semibold text-white">Sign In</p>
                </div>
              </div>
            )}
          </div>
          <button onClick={closeMenu}>
            <X className="text-white" />
          </button>
        </div>
        {/* ✨ Style Tip or Deal */}
        <div className="bg-gray-800 rounded-md p-3 mt-2 w-full">
          <p className="text-xs text-gray-200 font-medium">
            🎁 20% off on new arrivals — explore now!
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col mt-4 gap-6 px-6  text-black">
        <div className="flex items-center justify-between">
          <button className="text-left text-sm text-gray-700 font-semibold ">
            Men
          </button>
          <button className="text-md text-gray-700 font-semibold">{">"}</button>
        </div>
        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-700 font-semibold ">
            Women
          </button>
          <button className="text-md text-gray-700 font-semibold">{">"}</button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-700 font-semibold ">
            Kids
          </button>
          <button className="text-md text-gray-700 font-semibold">{">"}</button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-700 font-semibold ">
            Home & Living
          </button>
          <button className="text-md text-gray-700 font-semibold">{">"}</button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-700 font-semibold ">
            Beauty
          </button>
          <button className="text-md text-gray-700 font-semibold">{">"}</button>
        </div>
        {/* border */}
      </div>
      <div className="border mt-4"></div>

      {/* secong menu */}
      <div className="flex flex-col mt-4 gap-8 px-6  text-black">
        {email && (
          <div className="flex items-center justify-between">
            <button
              className="text-left text-sm text-gray-500 font-semibold"
              onClick={() => naviage("/user/account")}
            >
              Account
            </button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-500 font-semibold ">
            Orders
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-500 font-semibold ">
            Mynstars Insider
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-500 font-semibold ">
            Gift Cards
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-500 font-semibold ">
            Contact Us
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-500 font-semibold ">
            FAQs
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button className="ttext-left text-sm text-gray-500 font-semibold ">
            Legal
          </button>
        </div>
      </div>
    </>
  );
};
