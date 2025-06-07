import { useLocation, useNavigate } from "react-router-dom";

export function SidebarAccount() {
  const navigate = useNavigate();

  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="">
      <div className="flex border-t-1 border-gray-300 rounded-sm overflow-hidden ">
        <aside className="w-60 border-r border-gray-300 px-6 pt-4 hidden md:block">
          <h2 className="text-lg font-bold mb-1">Account</h2>
          <p className="text-sm text-gray-600 mb-2">harsha</p>

          <hr />

          <nav className="space-y-3 mt-3 text-sm text-gray-800">
            <div>
              <p className="text-gray-500 uppercase font-semibold text-xs mb-2">
                Overview
              </p>
              <ul className="space-y-1">
                <li className="text-gray-800 cursor-pointer">Overview</li>
              </ul>
            </div>

            <hr />

            <div>
              <p className="text-gray-500 uppercase font-semibold text-xs mb-2">
                Orders
              </p>
              <ul className="space-y-2">
                <li
                  className={`cursor-pointer ${
                    isActive("/user/my/orders")
                      ? "text-[#14CDA8] font-semibold"
                      : "text-gray-800"
                  }`}
                  onClick={() => navigate("/user/my/orders")}
                >
                  Orders & Returns
                </li>
              </ul>
            </div>

            <hr />

            <div>
              <p className="text-gray-500 uppercase font-semibold text-xs mb-2">
                Credits
              </p>
              <ul className="space-y-2">
                <li className="cursor-pointer">Coupons</li>
                <li className="cursor-pointer">Myntra Credit</li>
                <li className="cursor-pointer">MynCash</li>
              </ul>
            </div>

            <hr />

            <div>
              <p className="text-gray-500 uppercase font-semibold text-xs mb-2">
                Account
              </p>
              <ul className="space-y-2">
                <li
                  className={`cursor-pointer ${
                    isActive("/user/profile/edit")
                      ? "text-pink-600 font-semibold"
                      : "text-gray-800"
                  }`}
                  onClick={() => navigate("/user/profile/edit")}
                >
                  Profile
                </li>
                <li className="cursor-pointer">Saved Cards</li>
                <li className="cursor-pointer">Saved UPI</li>
                <li className="cursor-pointer">Saved Wallets/BNPL</li>
                <li
                  className={`cursor-pointer ${
                    isActive("/user/my/address")
                      ? "text-green-600 font-semibold"
                      : "text-gray-800"
                  }`}
                  onClick={() => navigate("/user/my/address")}
                >
                  Addresses
                </li>
              </ul>
            </div>
          </nav>
        </aside>
      </div>
    </div>
  );
}
