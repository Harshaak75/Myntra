import { useForm } from "react-hook-form";
import { Button } from "../../Components/Button.tsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Sidebar from "../../Components/Sidebar.tsx";
import axios from "axios";
import { backend_url } from "../../../config.tsx";

interface FormData {
  category?: string;
  shopName?: string;
  address1?: string;
  address2?: string;
  gstnumber?: string;
  pannumber?: string;
  pincode?: string;
  city?: string;
}

export default function SellerDetails() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ mode: "onBlur" });

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const [loading, setloading] = useState(false);

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

  function isValidGST(gstnumber: any) {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(gstnumber);
  }

  function isValidPAN(pannumber: any) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pannumber);
  }

  const onSubmit = async (data: FormData) => {
    setloading(true);

    const formDataWithTags = { ...data, categories: tags };

    if (!isValidGST(formDataWithTags.gstnumber)) {
      alert("Invalid GST Number! Please enter a valid format.");
      return;
    }

    if (!isValidPAN(formDataWithTags.pannumber)) {
      alert("Invalid PAN Number! Please enter a valid format.");
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}seller/updatesellershop`,
        formDataWithTags,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authorization")}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      alert("The data was successfully uploaded.");
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setloading(false);
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

      <Sidebar />

      {/* Form Container */}
      <div className="w-full bg-white p-6 mt-20 shadow-xl rounded-xl max-w-xl ml-10 flex justify-start">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Seller Details Update
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Fill in your details to update as a seller
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-400">
                Seller Shop
              </label>
              <input
                {...register("shopName")}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">
                Address1
              </label>
              <input
                {...register("address1")}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">
                Address2
              </label>
              <input
                {...register("address2")}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-400">
                  Pincode
                </label>
                <input
                  {...register("pincode")}
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
              <input
                {...register("gstnumber", {
                  required: "GST Number is required",
                  validate: (value) => isValidGST(value) || "Invalid GST Number format",
                })}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              {errors.gstnumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gstnumber.message}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">
                PAN Number
              </label>
              <input
                {...register("pannumber", {
                  required: "PAN Number is required",
                  validate: (value) => isValidPAN(value) || "Invalid PAN Number format",
                })}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
              {errors.pannumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pannumber.message}</p>}
            </div>
            {/* Tag Input */}
            <div>
              <label className="text-sm font-semibold text-gray-400">
                Selling Categories
              </label>
              <div className="flex flex-wrap gap-2 border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-2 py-1 rounded-lg flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-red-500"
                      onClick={() => removeTag(index)}
                    >
                      ×
                    </button>
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

            <Button
              type="submit"
              style={{ backgroundColor: "#FF3F6C" }}
              className={`w-full rounded-lg py-2 text-md font-semibold transition shadow-md ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? "Uploading..." : "SUBMIT"}
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
