import {
    Banknote,
    FileCog,
    LayoutDashboard,
    UserSearch,
    Tickets,
    LucideIcon,
  } from "lucide-react";


const sellerGridIcons: Record<string, LucideIcon> = {
    Banknote,
    LayoutDashboard,
    FileCog,
    UserSearch,
    Tickets,
  };
  
  const sellerGridIconsSize: Record<string, number> = {
    Banknote: 20,
    LayoutDashboard: 20,
    FileCog: 20,
    UserSearch: 20,
    Tickets: 20,
  };
  
  const sellerGridIconsLabel: Record<string, string> = {
    Banknote: "Payment Summary",
    LayoutDashboard: "Reconciliation Dashboard",
    FileCog: "Operational Reports",
    UserSearch: "Partner University",
    Tickets: "Raise a Ticket",
  };

export default function GridSellerDashboard() {
    return (
        <div className="">
        <div className="grid grid-cols-4 gap-4 p-5 ">
          {/* Left Sidebar (2 Stacked Boxes) */}
          <div className="col-span-1 flex flex-col gap-4 w-[90%] mx-auto">
            <div className="bg-white shadow-md p-4 rounded-lg h-[10rem] flex flex-col justify-between">
              <div className="">
                <h2 className="text-lg font-bold">Hello MFKI!</h2>
                <p className="text-sm">MODE-LINK LIFESTYLE SOLUTIONS LLP</p>
              </div>
              <div className="text-sm font-medium">
                <p>Welcome to Partner Portal</p>
                <p>One place for all your interaction with Myntra</p>
              </div>
            </div>
            <div className="bg-white shadow-md p-4 rounded-lg h-[17rem]">
              <h3 className="text-md font-semibold mb-0.5">Useful Links</h3>
              <ul className="text-[#0bc1a9]">
                {Object.entries(sellerGridIcons).map(([keys, Icon]) => (
                  <div className="p-2">
                    <a href="" className="flex gap-2 items-center">
                      <Icon size={sellerGridIconsSize?.[keys]} />{" "}
                      {sellerGridIconsLabel?.[keys]}
                    </a>
                  </div>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content (Grid inside a Grid) */}
          <div className="col-span-2 grid grid-cols-2 gap-5">
            <div className="col-span-2 bg-white shadow-md p-4 rounded-lg h-[7.5rem] flex flex-col gap-3">
              <h3 className="text-md font-semibold text-[#0bc1a9]">
                Orders Compliance (PPMP)
              </h3>
              <div className="flex justify-around ">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">196</p>
                  <p>Total Orders</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">97.96</p>
                  <p>Packing Compliance</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">86.22</p>
                  <p>Handover Compliance</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">0</p>
                  <p>VFS Compliance</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-white shadow-md p-4 rounded-lg h-[7.5rem] flex flex-col gap-3">
              <h3 className="text-md font-semibold text-[#0bc1a9]">
                Orders Compliance (OMNI)
              </h3>
              <div className="flex justify-around ">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">0</p>
                  <p>Total Orders</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">0</p>
                  <p>Packing Compliance</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">0</p>
                  <p>Handover Compliance</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">0</p>
                  <p>VFS Compliance</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 bg-white shadow-md p-4 rounded-lg h-[7.5rem] flex flex-col gap-3">
              <h3 className="text-md font-semibold text-[#0bc1a9]">Payments</h3>
              <div className="flex justify-around ">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">₹ 13,905</p>
                  <p>Next Payment</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">₹ 22,22,037</p>
                  <p>Total Outstnding Payment</p>
                </div>
                <div className="bg-gray-300 w-0.5 opacity-40"></div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xl font-medium">₹ 16,59,663</p>
                  <p>Pyments Till Date</p>
                </div>
              </div>
            </div>
            <div className="col-span-2 h-[9.5rem] bg-white shadow-md p-4 rounded-lg">
              <h3 className="text-md font-semibold text-[#0bc1a9]">Pending Tasks</h3>
              <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2"></div>
              <div className="">
                <p className="font-bold">Style Status Updates</p>
                <p className="text-gray-500">7 styles has been delisted due to an issue. Please check dashboard for a reasons.</p>
              </div>
              <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2"></div>
            </div>
          </div>

          {/* Right Sidebar (3 Stacked Boxes) */}
          <div className="col-span-1 flex flex-col gap-4 w-[90%] mx-auto">
            <div className="bg-white shadow-md p-4 rounded-lg h-[17rem]">
              <h3 className="text-md font-semibold">Announcements</h3>
              <p>Correct Discount Uploads Required</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-lg ">
              <h3 className="text-md font-semibold">What's New</h3>
              <p>Coming Soon</p>
            </div>
            <div className="bg-white shadow-md p-4 rounded-lg h-[10rem]">
              <h3 className="text-md font-semibold">Buyer's QnA</h3>
              <p>Does it come with hooks?</p>
            </div>
          </div>
        </div>

        
      </div>
    )
}