import { useState } from "react";
import { useSelector } from "react-redux";

export default function AccountPage() {
  const email = useSelector((state: any) => state.auth.email);
  const [gender, setGender] = useState("");

  return (
    <div className="min-h-screen mt-20 bg-white px-4 py-10 md:px-16 lg:px-28">
      <div className="flex border-t-1 border-gray-300 rounded-sm overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-gray-300 px-6 pt-4 hidden md:block">
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
                <li className="cursor-pointer">Orders & Returns</li>
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
                <li className="text-pink-600 font-semibold cursor-pointer">
                  Profile
                </li>
                <li className="cursor-pointer">Saved Cards</li>
                <li className="cursor-pointer">Saved UPI</li>
                <li className="cursor-pointer">Saved Wallets/BNPL</li>
                <li className="cursor-pointer">Addresses</li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <div className="border border-gray-300 p-8 rounded-sm">
            <h2 className="text-xl font-bold mb-6">Edit Details</h2>
            <hr className="mb-6" />

            <div className="grid gap-5">
              {/* Mobile Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email Id*
                </label>
                <div
                  className={`flex items-center border border-gray-300 bg-gray-200 rounded px-3 py-2 cursor-not-allowed`}
                >
                  <input
                    type="email"
                    value={email}
                    disabled={true}
                    className={`text-gray-800 cursor-not-allowed`}
                  />
                  <span className="ml-2 text-green-500">✔</span>
                  <button
                    className={`ml-auto text-sm font-semibold cursor-pointer text-[#ff3f6ce0]`}
                  >
                    CHANGE
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value=""
                  placeholder="Enter your name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="number"
                  placeholder="Enter you mobile number"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-2 border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => setGender("Male")}
                    className={`py-2 cursor-pointer border-r border-gray-300 ${
                      gender === "Male"
                        ? "bg-[#ff3f6ce0] text-white font-semibold"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    Male
                  </button>
                  <button
                    onClick={() => setGender("Female")}
                    className={`py-2 cursor-pointer ${
                      gender === "Female"
                        ? "bg-[#ff3f6ce0] text-white font-semibold"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Birthday */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Birthday (dd/mm/yyyy)
                </label>
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Alternate Mobile */}
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Alternate Mobile Details
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="+91"
                    className="w-1/4 border border-gray-300 rounded px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    className="w-3/4 border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Hint Name */}
              <div>
                <input
                  type="text"
                  placeholder="Hint name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Save Button */}
              <div>
                <button className="w-full bg-[#ff3f6ce0] text-white font-semibold py-3 rounded hover:bg-[#ff3f6ccf] cursor-pointer">
                  SAVE DETAILS
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
