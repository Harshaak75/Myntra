import { useEffect, useState } from "react";
import axios from "axios";
import { getSupabaseClient } from "@/SupabaseClient";
import { AdminValidToken } from "@/Utiles/ValidateToken";
import { backend_url, excel_supabase_key, excel_supabase_url } from "../../../config";
import { createClient } from "@supabase/supabase-js";

// Excel Storage Client
const supabaseExcel = createClient(excel_supabase_url, excel_supabase_key);

export function ManageProduct() {
  const [sellers, setSellers] = useState<{ id: number; firstname: string }[]>([]);
  const [selectedSellerId, setSelectedSellerId] = useState<number | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [excelFilesByCategory, setExcelFilesByCategory] = useState<{ [cat: string]: { name: string; publicUrl: string }[] }>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await AdminValidToken();
        if (!token) return;
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase.from("Product").select("sellerId").eq("status", "Pending");
        if (error) throw error;

        const uniqueIds = Array.from(new Set(data.map((item) => item.sellerId)));
        const sellerRes = await axios.post(`${backend_url}ProductAdmin/get-seller-name`, { uniqueIds }, { headers: { Authorization: `Bearer ${token}` } });
        setSellers(sellerRes.data.data);
      } catch (err) {
        console.error("Fetch seller error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchDataForSeller = async (sellerId: number) => {
    try {
      setLoading(true);
      const token = await AdminValidToken();
      if (!token) return;

      const supabase = getSupabaseClient(token);
      const { data: productData } = await supabase.from("Product").select("*").eq("status", "Pending").eq("sellerId", sellerId);
      setProducts(productData || []);

      const { data: filesData } = await supabaseExcel.storage.from("productdetails").list("excel", { limit: 1000 });

      const categoryMap: { [cat: string]: { name: string; publicUrl: string }[] } = {};
      filesData?.forEach((file) => {
        if (!file.name) return;
        const fileName = file.name;
        const categoryName = fileName.split("_")[1]?.split(".")[0]?.toLowerCase();
        if (categoryName) {
          const { data } = supabaseExcel.storage.from("productdetails").getPublicUrl(`excel/${fileName}`);
          if (!categoryMap[categoryName]) {
            categoryMap[categoryName] = [];
          }
          categoryMap[categoryName].push({ name: fileName, publicUrl: data.publicUrl });
        }
      });

      setExcelFilesByCategory(categoryMap);

      if (productData) {
        const types = productData
          .map((prod) => cleanCategory(prod.productType))
          .filter((type) => type && !["undefined", "myntra", "myntra-template"].includes(type.toLowerCase()));

        const uniqueTypes = Array.from(new Set(types));
        setCategories(uniqueTypes);
      }
    } catch (err) {
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cleanCategory = (type: string) => {
    if (!type) return "";
    return type.toLowerCase().replace(/-template.*$/, "").replace(/_\d+$/, "").replace(/-/g, " ").trim();
  };

  const handleSellerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setSelectedSellerId(id);
    setSelectedCategory(null);
    fetchDataForSeller(id);
  };

  const handleApproval = async (productId: number, status: "Approved" | "Rejected") => {
    try {
      setLoading(true);
    const token = await AdminValidToken();
    if (!token) {
      console.error("Token not found. Please login again.");
      return;
    }

    const response = await axios.put(`${backend_url}ProductAdmin/update`,{
      productId,
      status,
    },{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      console.log("Status updated successfully:", response.data);
      setProducts((prev) => prev.filter((prod) => prod.id !== productId));
      alert("Status updated successfully");
      setLoading(false);
    } else {
      console.error("Failed to update status:", response.data);
      setLoading(false);
    }
  }catch(error){
    console.error("Error updating status:", error);
    alert("Failed to update status. Please try again.");
  }
  finally{
    setLoading(false);
  }
}

  const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => cleanCategory(p.productType) === selectedCategory)
    : [];

  return (
    <div className="flex flex-col p-6 ml-[15rem] min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Manage Products</h1>
      <span className="text-gray-500 mb-6"><span className="text-blue-700 font-semibold">Home</span> <span className="mx-1">{">"}</span> Manage Products</span>

      {/* Seller Dropdown */}
      {!loading && sellers.length > 0 ? (
        <div className="w-72 mb-8">
          <select
            className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedSellerId || ""}
            onChange={handleSellerSelect}
          >
            <option value="">Select a Seller</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.firstname}
              </option>
            ))}
          </select>
        </div>
      ) : !loading && <p className="text-red-500 mb-6">Error loading sellers. Please retry.</p>}

      {/* Category List */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Category</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg border ${selectedCategory === cat ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Excel Files Download */}
      {/* {selectedCategory && (() => {
        const normalizedCategory = selectedCategory.toLowerCase().replace(/\s+/g, "");
        const matchedFiles = Object.entries(excelFilesByCategory)
          .filter(([key]) => key.replace(/\s+/g, "").includes(normalizedCategory))
          .flatMap(([_, files]) => files)
          .sort((a, b) => b.name.localeCompare(a.name));

        return matchedFiles.length > 0 ? (
          <div className="mb-8 flex gap-4">
            {matchedFiles.slice(0, 2).map((file, idx) => (
              <button
                key={idx}
                onClick={() => downloadFile(file.publicUrl, file.name)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                Download File {idx + 1}
              </button>
            ))}
          </div>
        ) : null;
      })()} */}

      {/* Products Table */}
      {selectedCategory && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3">Product Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Created At</th>
                <th className="px-6 py-3">Product SKU</th>
                <th className="px-6 py-3">Seller SKU</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4">{p.name}</td>
                    <td className="px-6 py-4">{p.price}</td>
                    <td className="px-6 py-4">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{p.productSku}</td>
                    <td className="px-6 py-4">{p.sellerSku}</td>
                    <td className="px-6 py-4">{cleanCategory(p.productType)}</td>
                    <td className="px-6 py-4">{p.status}</td>
                    <td className="px-6 py-4 flex gap-2">
                      <button onClick={() => handleApproval(p.id, "Approved")} className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-sm">Accept</button>
                      <button onClick={() => handleApproval(p.id, "Rejected")} className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm">Reject</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-6 text-gray-600">No pending products for selected category.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Loader */}
      {loading && (
          <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-50">
            <div className="loader"></div>
          </div>
        )}
    </div>
  );
}
