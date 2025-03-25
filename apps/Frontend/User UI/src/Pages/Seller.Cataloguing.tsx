import { Store, BookText, ShieldQuestion, X } from "lucide-react";
import Icon from "../Components/Icon";
import { useState } from "react";
import axios from "axios";

export default function SellerCatalog() {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState("");

  const [loading, setloading] = useState(false);

  function downloadExcel(category: string) {
    if (!category) return;

    try {
      setloading(true);
      axios
        .post(
          "http://localhost:3000/seller/download_excel",
          { category: category }, // Request body
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob", // Important: This tells Axios to return a Blob
          }
        )
        .then((response) => {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${category}-template.xlsx`; // Downloaded file name
          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
          
        })
        .catch((error) => console.error("Error downloading Excel:", error));

      setloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="grid grid-cols-4 bg-gray-100 p-3 relative">
      {/* sidebar */}
      <div className="col-span-1 h-[26rem] bg-white flex flex-col gap-5 justify-center text-[1rem] rounded-lg overflow-auto">
        <div className="flex gap-10 pl-10">
          <Store width={"1rem"} className="" />
          <p className="font-semibold text-[#0bc1a9]"> Catalog Management</p>
        </div>

        <div className="flex pl-24">
          <p>Cataloguing</p>
        </div>

        <div className="flex pl-24">
          <p>Add Listings to Existing Style</p>
        </div>

        <div className="flex pl-24">
          <p>Model/Image Approval form</p>
        </div>

        <div className="flex pl-24">
          <p>Image Uploader</p>
        </div>

        <div className="flex pl-24">
          <p>Training & FAQ</p>
        </div>

        <div className="flex pl-24">
          <p>Catalog Correction/Resubmission Form</p>
        </div>

        <div className="flex gap-10 pl-10">
          <BookText width={"1rem"} className="" />
          <p className="font-semibold text-[#0bc1a9]"> Listings</p>
        </div>

        <div className="flex gap-10 pl-10">
          <ShieldQuestion width={"1rem"} className="" />
          <p className="font-semibold text-[#0bc1a9]">Buyer Questions</p>
        </div>
      </div>

      {/* header */}

      <div className="p-3 col-span-3 flex flex-col gap-2">
        {/* heading */}

        <div className="flex justify-between">
          <div className="text-2xl font-semibold font-sans">
            <h1>My Cataloguing Management</h1>
          </div>
          {/* button */}
          <div className="flex mt-20 gap-10">
            <button
              onClick={() => setIsOpen(true)}
              className="border px-3 py-2 rounded text-[#0bc1a9] bg-white border-[#0bc1a9] cursor-pointer"
            >
              Download DIY Template
            </button>
            <button className="border px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer">
              Add New DIY Products
            </button>
            <button className="border px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer">
              Create MAS Request
            </button>
          </div>
        </div>

        {/* tabel  */}

        <div className="h-full bg-white mt-2 p-4">
          {/* topbar */}

          <div className="flex gap-8 text-lg text-gray-600">
            <div className="h-full">Lot view</div>
            <p>Style view</p>
          </div>
          <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2"></div>

          {/* options */}
          <div className="">
            {/* heading */}
            <div className="text-lg font-semibold">Search By</div>
            {/* select options */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-13 py-5">
                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Store</label>
                  <select className=" border-b-1 border-gray-400 mt-2 outline-none">
                    <option>Select...</option>
                  </select>
                </div>

                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Lot ID</label>
                  <input
                    type="text"
                    className="border-b-1 border-gray-400 outline-none mt-2"
                    placeholder="Enter Lot ID"
                  />
                </div>

                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Uploaded Date</label>
                  <input
                    type="date"
                    className="border-b-1 border-gray-400 mt-2 outline-none"
                  />
                </div>

                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Last Updated Date</label>
                  <input
                    type="date"
                    className="border-b-1 border-gray-400 mt-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-13 py-2">
                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Status</label>
                  <select className=" border-b-1 border-gray-400 mt-2 outline-none">
                    <option>Select...</option>
                  </select>
                </div>

                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Brand</label>
                  <select className=" border-b-1 border-gray-400 mt-2 outline-none">
                    <option>Select...</option>
                  </select>
                </div>

                <div className="flex flex-col w-[14rem]">
                  <label className="text-gray-600">Source</label>
                  <select className=" border-b-1 border-gray-400 mt-2 outline-none">
                    <option>Select...</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end mt-7">
            <button className="border w-[8rem] px-1 py-1 rounded text-[#0bc1a9] bg-white border-[#0bc1a9] cursor-pointer">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* download template box */}

      {isOpen && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-40 "
            onClick={() => setIsOpen(false)} // Clicking outside closes modal
          ></div>

          {/* Modal Box */}
          <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[20rem] bg-white p-3 rounded-md shadow-2xl z-50 transition-all duration-700 ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
            <p className="text-3xl text-gray-500">
              Download Attribute Sheet Template
            </p>
            <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2"></div>
            <p className="text-sm font-semibold text-gray-400">
              Select the article types that you want to add and download the
              sample template
            </p>

            {/* Select Dropdown */}
            <div className="flex flex-col w-full mt-5">
              <select
                className="border-b border-gray-400 mt-2 outline-none"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option>Select...</option>
                <option>saree</option>
                <option>tShirt</option>
                <option>jeans</option>
                <option>kurti</option>
                <option>jacket</option>
              </select>
            </div>

            <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2 mt-6"></div>

            {/* Download Button */}
            <div className="flex justify-end mt-7">
              <button
                onClick={() => downloadExcel(selectedItem)}
                className="border w-[12rem] px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer"
                disabled={loading}
              >
                {loading? "Downloading.." : "Download Template"}
                {/* Download Template */}
              </button>
            </div>

            {/* Close Button */}
            <X
              className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-black"
              onClick={() => setIsOpen(false)}
              size={24}
            />
          </div>
        </>
      )}
    </div>
  );
}
