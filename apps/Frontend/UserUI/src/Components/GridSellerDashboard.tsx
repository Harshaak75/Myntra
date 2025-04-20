import axios from "axios";
import {
  Banknote,
  FileCog,
  LayoutDashboard,
  UserSearch,
  Tickets,
  LucideIcon,
} from "lucide-react";
import { backend_url } from "../../config";
import { useEffect, useState } from "react";

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
  const [email, setemail] = useState(() => localStorage.getItem("email"));

  useEffect(() => {
    if (!email) {
      fetchEmail();
    }
  }, [email]);

  const fetchEmail = async () => {
    try {
      const response = await axios.get(`${backend_url}seller/email`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("authorization")}`,
        },
        withCredentials: true,
      });
  
      console.log(JSON.stringify(response.data)); // Debugging
  
      // ✅ Corrected way to access email
      const email = response.data.responone?.email;
  
      if (email) {
        localStorage.setItem("email", email);
        setemail(email);
      } else {
        console.error("Email not found in response");
      }
    } catch (error: any) {
      console.error("Error fetching email:", error.message);
    }
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Sidebar */}
        <div className="col-span-1 flex flex-col gap-4 w-full md:w-[90%] mx-auto">
          <div className="bg-white shadow-md p-4 rounded-lg flex flex-col justify-between">
            <h2 className="text-lg font-bold">Hello MFKI!</h2>
            <p className="text-sm">MODE-LINK LIFESTYLE SOLUTIONS LLP</p>
            <div className="text-[0.825rem] font-medium">
              <p>Welcome to Partner Portal</p>
              <p>One place for all your interaction with Mynstars</p>
            </div>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Useful Links</h3>
            <ul className="text-[#0bc1a9]">
              {Object.entries(sellerGridIcons).map(([keys, Icon]) => (
                <div className="p-2">
                  <a href="#" className="flex gap-2 items-center">
                    <Icon size={sellerGridIconsSize?.[keys]} />
                    {sellerGridIconsLabel?.[keys]}
                  </a>
                </div>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Orders Compliance (PPMP) */}
          <div className="col-span-2 bg-white shadow-md p-4 rounded-lg flex flex-col gap-3">
            <h3 className="text-md font-semibold text-[#0bc1a9]">
              Orders Compliance (PPMP)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-medium">196</p>
                <p>Total Orders</p>
              </div>
              <div>
                <p className="text-xl font-medium">97.96</p>
                <p>Packing Compliance</p>
              </div>
              <div>
                <p className="text-xl font-medium">86.22</p>
                <p>Handover Compliance</p>
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p>VFS Compliance</p>
              </div>
            </div>
          </div>

          {/* Orders Compliance (OMNI) */}
          <div className="col-span-2 bg-white shadow-md p-4 rounded-lg flex flex-col gap-3">
            <h3 className="text-md font-semibold text-[#0bc1a9]">
              Orders Compliance (OMNI)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xl font-medium">0</p>
                <p>Total Orders</p>
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p>Packing Compliance</p>
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p>Handover Compliance</p>
              </div>
              <div>
                <p className="text-xl font-medium">0</p>
                <p>VFS Compliance</p>
              </div>
            </div>
          </div>

          {/* Payments */}

          <div className="col-span-2 bg-white shadow-md p-4 rounded-lg flex flex-col gap-3">
            <h3 className="text-md font-semibold text-[#0bc1a9] text-center">
              Payments
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              {/* Next Payment */}
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-2xl font-semibold">₹ 13,905</p>
                <p className="text-sm text-gray-500">Next Payment</p>
              </div>

              {/* Total Outstanding */}
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-2xl font-semibold">₹ 22,22,037</p>
                <p className="text-sm text-gray-500">Total Outstanding</p>
              </div>

              {/* Payments Till Date */}
              <div className="flex flex-col items-center justify-center py-2">
                <p className="text-2xl font-semibold">₹ 16,59,663</p>
                <p className="text-sm text-gray-500">Payments Till Date</p>
              </div>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="col-span-2 bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-md font-semibold text-[#0bc1a9]">
              Pending Tasks
            </h3>
            <div className="border-t border-gray-300 my-2"></div>
            <p className="font-bold">Style Status Updates</p>
            <p className="text-gray-500">
              7 styles have been delisted due to an issue. Please check the
              dashboard for details.
            </p>
            <div className="border-t border-gray-300 my-2"></div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-span-1 flex flex-col gap-4 w-full md:w-[90%] mx-auto">
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-md font-semibold">Announcements</h3>
            <p>Correct Discount Uploads Required</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-md font-semibold">What's New</h3>
            <p>Coming Soon</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <h3 className="text-md font-semibold">Buyer's QnA</h3>
            <p>Does it come with hooks?</p>
          </div>
        </div>
      </div>
    </div>
  );
}
