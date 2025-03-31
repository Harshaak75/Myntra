import { useForm } from "react-hook-form";
import { Button } from "../../Components/Button.tsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar.tsx";
import axios from "axios";
import { backend_url } from "../../../config.tsx";

interface FormData {
  category: string;
  shopName : string;
  address1: string;
  address2: string;
  gstnumber: string;
  pannumber: string;
  pincode : string;
  city : string;
}

export default function SellerDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("sellerFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      reset(parsedData);
      setTags(parsedData.categories || []);
    }
  }, [reset]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    const formDataWithTags = { ...data, categories: tags };
    try {
      const response = await axios.post(`${backend_url}seller/updatesellershop`, formDataWithTags,{
        headers: { Authorization: `Bearer ${localStorage.getItem("authorization")}` },
        withCredentials: true
      })
      console.log(response.data)
    } catch (error: any) {
      console.error(error.message);
    }
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-start justify-center min-h-screen overflow-hidden bg-white p-6 lg:flex-row lg:items-center lg:pr-32"
    >
      {/* Sidebar */}

      <Sidebar/>

      {/* Form Container */}
      <div className="w-full bg-white p-6 mt-20 shadow-xl rounded-xl max-w-xl ml-10 flex justify-start">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">Seller Details Update</h2>
          <p className="text-center text-gray-500 mb-6">Fill in your details to update as a seller</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-400">Seller Shop</label>
              <input {...register("shopName", { required: "Required" })} className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">Address1</label>
              <input {...register("address1", { required: "Required" })} className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">Address2</label>
              <input {...register("address2", { required: "Required" })} className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-400">
                  Pincode
                </label>
                <input
                  {...register("pincode", { required: "Required" })}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400">
                  City
                </label>
                <input
                  {...register("city")}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">GST</label>
              <input {...register("gstnumber", { required: "Required" })} className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">PAN Number</label>
              <input {...register("pannumber", { required: "Required" })} className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm" />
            </div>
            
            {/* Tag Input */}
            <div>
              <label className="text-sm font-semibold text-gray-400">Selling Categories</label>
              <div className="flex flex-wrap gap-2 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded-lg flex items-center">
                    {tag}
                    <button type="button" className="ml-2 text-red-500" onClick={() => removeTag(index)}>×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow focus:outline-none"
                  placeholder="Type and press enter"
                />
              </div>
            </div>

            <Button type="submit" style={{backgroundColor: "#FF3F6C"}} className="w-full rounded-lg py-2 text-md font-semibold transition shadow-md cursor-pointer">
              SUBMIT
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}