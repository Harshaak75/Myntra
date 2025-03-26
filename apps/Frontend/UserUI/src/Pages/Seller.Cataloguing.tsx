import { Store, BookText, ShieldQuestion, X } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { upload_token_temp } from "../../config";

export default function SellerCatalog() {
  const [isOpen, setIsOpen] = useState(false);
  const [addProduct, setaddProduct] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [studio, setstudio] = useState("");
  const [store, setstore] = useState("");
  const [loading, setloading] = useState(false);
  const [selectfile, setselectfile] = useState<File | null>(null);

  const handlefile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setselectfile(file);
  };

  function downloadExcel(category: string) {
    if (!category) return;

    try {
      setloading(true);
      axios
        .post(
          "http://localhost:3000/seller/download_excel",
          { category: category },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob",
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
          a.download = `${category}-template.xlsx`;
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

  const uploadfile = async (file: any) => {
    if (!file) {
      console.error("File not found");
      alert("Please Upload file");
      return;
    }

    if (
      !store ||
      !studio ||
      store == "Select Store..." ||
      studio == "Select Studio..."
    ) {
      alert("please fill all options");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setloading(true);
      await axios.post(
        "http://localhost:3000/seller/upload_documents",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: upload_token_temp,
          },
        }
      );
      console.log("File uploaded successfully");
      alert("File uploaded successfully!");
      setselectfile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setloading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 bg-gray-100 p-3 relative gap-4">
      {/* sidebar */}
      <div className="lg:col-span-1 bg-white flex flex-col gap-5 p-5 rounded-lg overflow-auto">
        <div className="flex gap-4 items-center">
          <Store width={"1rem"} />
          <p className="font-semibold text-[#0bc1a9]">Catalog Management</p>
        </div>
        <p className="pl-5">Cataloguing</p>
        <p className="pl-5">Add Listings to Existing Style</p>
        <p className="pl-5">Model/Image Approval form</p>
        <p className="pl-5">Image Uploader</p>
        <p className="pl-5">Training & FAQ</p>
        <p className="pl-5">Catalog Correction/Resubmission Form</p>
        <div className="flex gap-4 items-center">
          <BookText width={"1rem"} />
          <p className="font-semibold text-[#0bc1a9]">Listings</p>
        </div>
        <div className="flex gap-4 items-center">
          <ShieldQuestion width={"1rem"} />
          <p className="font-semibold text-[#0bc1a9]">Buyer Questions</p>
        </div>
      </div>

      {/* main content */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold">My Cataloguing Management</h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="border px-3 py-2 rounded text-[#0bc1a9] bg-white border-[#0bc1a9] cursor-pointer"
            >
              Download DIY Template
            </button>
            <button
              onClick={() => setaddProduct(true)}
              className="border px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer"
            >
              Add New DIY Products
            </button>
            <button className="border px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer">
              Create MAS Request
            </button>
          </div>
        </div>

        {/* search options */}
        <div className="bg-white p-4 rounded-md">
          <div className="text-lg font-semibold">Search By</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <select className="border-b border-gray-400 outline-none p-2">
              <option>Select Store...</option>
            </select>
            <input
              type="text"
              className="border-b border-gray-400 outline-none p-2"
              placeholder="Enter Lot ID"
            />
            <input
              type="date"
              className="border-b border-gray-400 outline-none p-2"
            />
            <input
              type="date"
              className="border-b border-gray-400 outline-none p-2"
            />
          </div>
          <div className="flex justify-end mt-4">
            <button className="border px-4 py-2 rounded text-[#0bc1a9] bg-white border-[#0bc1a9] cursor-pointer">
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
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal Box */}
          <div
            className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 rounded-lg shadow-2xl z-50 transition-all duration-700 max-h-[90vh] overflow-y-auto ${
              isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            <p className="text-xl sm:text-2xl font-semibold text-gray-700">
              Download Attribute Sheet Template
            </p>
            <div className="bg-gray-300 w-full h-0.5 opacity-40 my-2"></div>
            <p className="text-sm font-semibold text-gray-400">
              Select the article types you want to add and download the sample
              template
            </p>

            {/* Select Dropdown */}
            <div className="flex flex-col w-full mt-5">
              <select
                className="border-b border-gray-400 mt-2 outline-none p-2 w-full"
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
                className="w-full sm:w-[12rem] px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer"
                disabled={loading}
              >
                {loading ? "Downloading.." : "Download Template"}
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

      {addProduct && (
        <>
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-40"
            onClick={() => setaddProduct(false)}
          ></div>

          {/* Modal Box */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 rounded-lg shadow-2xl z-50 transition-all duration-500 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center">
              <p className="text-xl sm:text-2xl font-semibold text-gray-700">
                Add New Product
              </p>
              <X
                className="cursor-pointer text-gray-500 hover:text-black"
                onClick={() => setaddProduct(false)}
                size={24}
              />
            </div>
            <div className="border-b border-gray-300 my-3"></div>

            {/* Description */}
            <p className="text-sm text-gray-500">
              Upload your filled attribute sheet to create a new list.
            </p>

            {/* Dropdown Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <select
                className="border border-gray-300 p-2 rounded-md outline-none w-full"
                onChange={(e) => setstore(e.target.value)}
              >
                <option>Select Store...</option>
                <option>Myntra</option>
                <option>Jabong</option>
              </select>

              <select
                className="border border-gray-300 p-2 rounded-md outline-none w-full"
                onChange={(e) => setstudio(e.target.value)}
              >
                <option>Select Studio...</option>
                <option>Studio A</option>
                <option>Studio B</option>
              </select>
            </div>

            {/* File Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <label className="bg-blue-500 text-white px-5 py-2 rounded-md cursor-pointer flex items-center justify-center w-full sm:w-auto">
                Choose File
                <input type="file" className="hidden" onChange={handlefile} />
              </label>
              <span className="text-gray-500 text-sm">
                {selectfile ? selectfile.name : "No file chosen"}
              </span>
            </div>

            <div className="border-b border-gray-300 my-4"></div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setaddProduct(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-[#0bc1a9] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => uploadfile(selectfile)}
                className="w-full sm:w-auto px-5 py-2 rounded-md text-white bg-[#0bc1a9] border-[#0bc1a9] cursor-pointer transition"
                disabled={loading}
              >
                {loading ? "Loading" : "Add Product"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
