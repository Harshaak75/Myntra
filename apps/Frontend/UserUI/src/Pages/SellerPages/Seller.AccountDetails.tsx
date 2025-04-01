import { useForm } from "react-hook-form";
import { Button } from "../../Components/Button.tsx";
import { motion } from "framer-motion";
import { User, Lock, Bell, LogOut } from "lucide-react";
import Sidebar from "../../Components/Sidebar.tsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { backend_url } from "../../../config.tsx";

interface FormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  pincode: string;
  city: string;
}

export default function SellerForm() {
  const email = localStorage.getItem("email");
  const [loading, setloading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setloading(true);
    console.log("loading form data")
    try {
      const response = await axios.post(`${backend_url}seller/updateSeller`, data,{
        headers: { Authorization: `Bearer ${localStorage.getItem("authorization")}` },
        withCredentials: true
      });
      console.log(response.data);
      alert("The data was successfully uploaded.")
    } catch (error: any) {
      console.error(error.message);
    }
    finally{
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
      <div className="w-full bg-white p-6 shadow-xl rounded-xl max-w-xl ml-10 flex justify-start">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Seller Registration
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Fill in your details to register as a seller
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-400">
                  First Name
                </label>
                <input
                  {...register("firstname", { required: "Required" })}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-400">
                  Last Name
                </label>
                <input
                  {...register("lastname", { required: "Required" })}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-400">
                Email
              </label>
              <input
                value={String(email)}
                readOnly
                disabled
                {...register("email", { required: "Required" })}
                className="w-full border px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed shadow-sm"
              />
            </div>

            {/* <div>
              <label className="text-sm font-semibold text-gray-400">
                Phone Number
              </label>
              <input
                {...register("phone", { required: "Required" })}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div> */}

            <div>
              <label className="text-sm font-semibold text-gray-400">
                Address Line 1
              </label>
              <input
                {...register("address1", { required: "Required" })}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-400">
                Address Line 2
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
