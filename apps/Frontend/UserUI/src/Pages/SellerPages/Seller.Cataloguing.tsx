import { Store, BookText, ShieldQuestion, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backend_url, upload_token_temp } from "../../../config";
import { useNavigate } from "react-router-dom";
import { getSellerIdFromToken, getValidToken } from "@/Utiles/ValidateToken";
import { getSupabaseClient } from "@/SupabaseClient";

export default function SellerCatalog() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [addProduct, setaddProduct] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [studio, setstudio] = useState("");
  const [store, setstore] = useState("");
  const [loading, setloading] = useState(false);
  const [selectfile, setselectfile] = useState<File | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const handlefile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setselectfile(file);
  };

  async function downloadExcel(category: string) {
    if (!category) return;
    setloading(true);
    console.log(backend_url);
    try {
      await axios
        .post(
          `${backend_url}seller/download_excel`,
          { category: category },
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${await getValidToken()}`,
            },
            withCredentials: true,
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
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              console.warn("Session expired. Redirecting to login.");
              localStorage.removeItem("authorization"); // Clear token
              navigate("/");
            }
          } else {
            console.error("Error downloading data:", error);
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setSelectedItem("");
      setloading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { token } = await getValidToken();
        if (!token) {
          console.error("Token missing.");
          return;
        }

        const supabase = getSupabaseClient(token);

        const seller_id = await getSellerIdFromToken(token); // Function to extract seller ID from token
        if (!seller_id) {
          console.error("Seller ID missing.");
          return;
        }

        // Now fetch products where sellerId == current user's id
        const { data, error } = await supabase
          .from("Product")
          .select("*")
          .eq("sellerId", seller_id);

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          console.log("Fetched Products:", data);
          setProducts(data || []);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const groupedProducts = useMemo(() => {
    const grouped: { [lotId: string]: any[] } = {};
    products.forEach((product) => {
      const lotId = product.lotId || "Unknown Lot";
      if (!grouped[lotId]) grouped[lotId] = [];
      grouped[lotId].push(product);
    });
    return grouped;
  }, [products]);

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
      await axios
        .post(`${backend_url}seller/upload_documents`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            // authorization: `Bearer ${localStorage.getItem("authorization")}`,
            authorization: `Bearer ${await getValidToken()}`,
          },
          withCredentials: true,
        })
        .then(() => {
          console.log("File uploaded successfully");
          alert("File uploaded successfully!");
          setselectfile(null);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              console.warn("Session expired. Redirecting to login.");
              localStorage.removeItem("authorization"); // Clear token
              navigate("/");
            }
          } else {
            console.error("Error uploading file:", error);
          }
        });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setloading(false);
  };

  const [selectedLot, setSelectedLot] = useState(null); // data
  const [showModal, setShowModal] = useState(false); // visibility

  const closeModal = () => {
    setShowModal(false);
    setSelectedLot(null);
  };

  const [product, setproduct] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState(null);

  const handleLot = async (lotid: any) => {
    setproduct([]);
    setloading(true);
    try {
      const response = await axios.post(
        `${backend_url}seller/getLotDetails`,
        {
          data: {
            lotId: lotid,
          },
        },
        { withCredentials: true }
      );

      console.log(response);
      setproduct(response.data.formatted);
      setSelectedLotId(lotid);
      setShowModal(true);
    } catch (error) {
      console.log("error", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 bg-gray-100 p-3 relative gap-4">
      {/* Sidebar */}
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

      {/* Main Content */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold">My Cataloguing Management</h1>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className={`border px-3 py-2 rounded text-[#0bc1a9] bg-white border-[#0bc1a9] ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={loading}
            >
              Download DIY Template
            </button>
            <button
              onClick={() => setaddProduct(true)}
              className={`border px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9] ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={loading}
            >
              Add New DIY Products
            </button>
            <button className="border px-4 py-2 rounded text-white bg-[#0bc1a9] border-[#0bc1a9]">
              Create MAS Request
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white p-4 rounded-md">
          <div className="text-lg font-semibold">Search By</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <select className="border-b border-gray-400 outline-none p-2">
              <option>Select Store...</option>
            </select>
            <input
              type="text"
              placeholder="Enter Lot ID"
              className="border-b border-gray-400 outline-none p-2"
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
            <button className="border px-4 py-2 rounded text-[#0bc1a9] bg-white border-[#0bc1a9]">
              Search
            </button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-md mt-6">
          <h2 className="text-xl font-semibold mb-4">My Lots</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 mx-auto my-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lot ID
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Styles
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lot Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted By
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded On
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.keys(groupedProducts).map((lotId) => {
                  const items = groupedProducts[lotId];
                  const firstItem = items[0];
                  return (
                    <tr key={lotId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm font-medium text-gray-900">
                        {lotId}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        {items.length} Styles
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        CATALOG ACTIVITY COMPLETED
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        {localStorage.getItem("email")}
                      </td>

                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        {new Date(firstItem.createdAt).toLocaleDateString() ||
                          "-"}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-500">
                        Catalog_Complete
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-right">
                        <button
                          className="text-[#0bc1a9] hover:underline cursor-pointer"
                          onClick={() => handleLot(lotId)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Download Template */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 rounded-lg shadow-2xl z-50">
            <p className="text-xl font-semibold">
              Download Attribute Sheet Template
            </p>
            <div className="bg-gray-300 w-full h-0.5 my-2"></div>
            <p className="text-sm text-gray-400">
              Select the article types you want to add and download the sample
              template
            </p>
            <div className="mt-5">
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="border-b border-gray-400 p-2 w-full"
              >
                <option>Select...</option>
                <option>saree</option>
                <option>tShirt</option>
                <option>jeans</option>
                <option>kurti</option>
                <option>jacket</option>
              </select>
            </div>
            <div className="flex justify-end mt-7">
              <button
                onClick={() => downloadExcel(selectedItem)}
                className={`w-full sm:w-[12rem] px-4 py-2 rounded text-white bg-[#0bc1a9] ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={loading}
              >
                {loading ? "Downloading..." : "Download Template"}
              </button>
            </div>
            <X
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setIsOpen(false)}
              size={24}
            />
          </div>
        </>
      )}

      {/* Modal: Add New Product */}
      {addProduct && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 backdrop-blur-sm z-40"
            onClick={() => setaddProduct(false)}
          ></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 rounded-lg shadow-2xl z-50">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">Add New Product</p>
              <X
                className="cursor-pointer"
                onClick={() => setaddProduct(false)}
                size={24}
              />
            </div>
            <div className="border-b border-gray-300 my-3"></div>
            <p className="text-sm text-gray-500">
              Upload your filled attribute sheet to create a new list.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              <select
                className="border p-2 rounded-md"
                onChange={(e) => setstore(e.target.value)}
              >
                <option>Select Store...</option>
                <option>Myntra</option>
                <option>Jabong</option>
              </select>
              <select
                className="border p-2 rounded-md"
                onChange={(e) => setstudio(e.target.value)}
              >
                <option>Select Studio...</option>
                <option>Studio A</option>
                <option>Studio B</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
              <label className="bg-blue-500 text-white px-5 py-2 rounded-md cursor-pointer">
                Choose File
                <input type="file" className="hidden" onChange={handlefile} />
              </label>
              <span className="text-gray-500 text-sm">
                {selectfile ? selectfile.name : "No file chosen"}
              </span>
            </div>
            <div className="border-b border-gray-300 my-4"></div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setaddProduct(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => uploadfile(selectfile)}
                className={`w-full sm:w-auto px-5 py-2 rounded-md text-white bg-[#0bc1a9] ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                disabled={loading}
              >
                {loading ? "Loading..." : "Add Product"}
              </button>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-70 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Products for Lot ID: {selectedLotId}
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {product.map((product: any) => {
                return (
                  <div
                    key={product.id}
                    className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-medium">Name: {product.name}</p>
                    <p className="text-sm text-gray-600">
                      Style: {product.productSku}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ₹{product.price}
                    </p>
                    {product.patternLink ? (
                      <a
                        href={product.patternLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm mt-1 inline-block"
                      >
                        View Pattern PDF
                      </a>
                    ) : (
                      <p className="text-xs text-red-500">No pattern link</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
}
