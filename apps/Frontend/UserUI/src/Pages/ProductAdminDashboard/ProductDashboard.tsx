// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Sidebar from "@/Components/ProductAdmin/Sidebar";
import ProductCard from "@/Components/ProductAdmin/ProductCard";
import Pdashboard from "@/Components/ProductAdmin/Pdashboard";

export default function Dashboard() {
  const [products, setProducts] = useState<
    { id: string; name: string; description: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/productAdmin/product/getAll")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleApprove = (id: any) => {
    fetch(`/api/productAdmin/product/${id}/approval`, { method: "PUT" });
  };

  const handleDelete = (id: any) => {
    fetch(`/api/productAdmin/product/delete/${id}`, { method: "DELETE" });
  };

  const handleEdit = (id: any) => {
    // Redirect to edit form or open a dialog
    alert(`Edit product: ${id}`);
  };

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className="flex-1 p-6 bg-gray-50 min-h-screen ml-[15rem]">
        <h1 className="text-[2rem] font-bold mb-1">Dashboard</h1>
        <span className="text-gray-500">
          <span className="text-blue-700 font-semibold">Home</span>  <span className="mx-1">{">"}</span> Dashboard
        </span>

        <Pdashboard />
      </main>
    </div>
  );
}
