"use client";

import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { CheckCircle2, Truck, MapPin, HelpCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Gettoken } from "@/Utiles/Gettoken";
import axios from "axios";
import { backend_url } from "../../../../config";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const addressSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(10, "Mobile is required"),
  pincode: z.string().min(6, "Pincode is required"),
  state: z.string().min(1, "State is required"),
  address: z.string().min(1, "Address is required"),
  locality: z.string().min(1, "Locality is required"),
  city: z.string().min(1, "City is required"),
  typeOfAddress: z.enum(["home", "office"]),
  isDefault: z.boolean(),
});
type AddressFormData = z.infer<typeof addressSchema>;

export default function OrderPlacedPage() {
  const { state } = useLocation();

  const orderId = state?.order.orderCode;
  const cartitems = state?.cartitems;

  const price = state?.finalprice

  const [addresses, setAddresses] = useState<AddressFormData[]>([]);

  const userId = state?.order.buyerId;

  const [loading, setloading] = useState(false);

  //   console.log(cartitems)

  const navigate = useNavigate();

  const fetchAddresses = async () => {
    setloading(true);
    const token = Gettoken();
    try {
      const res = await axios.get(`${backend_url}user/getAddresses`, {
        headers: {
          authorization: `bearer ${token}`,
        },
        withCredentials: true,
      });
      setAddresses(res.data.addresses || []);
      console.log("address", addresses);
    } catch (err: any) {
      if (err.status === 403 && err.response.data.message === "Invalid token") {
        navigate("/users/login");
      }
      console.error("Error fetching addresses:", err);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);
  return (
    <div className="min-h-screen w-[100%] mt-[2rem] bg-white p-4 sm:p-6 flex justify-center">
      <div className="w-full">
        <Card className="rounded-xl shadow-md w-full">
          <CardContent className="p-6 sm:p-10 space-y-6">
            {/* ✅ Header */}
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-600 w-6 h-6" />
              <h2 className="text-xl font-semibold text-green-700">
                Your Order is Confirmed!
              </h2>
            </div>

            {/* 📦 Order Info */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-bold tracking-wide">
                MNYSTARS-{orderId}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Expected Delivery:{" "}
                <span className="text-black font-medium">25 May 2025</span>
              </p>
            </div>

            {/* 🛍️ Product List */}
            <div className="space-y-4">
              {cartitems.map((item: any, idx: any) => {
                const product = item.product;
                const quantity = item.quantity || 1;
                const colorAttribute =
                  item.product.productAttribute.find(
                    (a: any) => a.attributename === "Color"
                  )?.attributevalue || "";

                const frontImage =
                  item.product.productAttribute.find(
                    (a: any) => a.attributename === "Front Image"
                  )?.attributevalue || "";

                console.log(colorAttribute);

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="flex gap-4 items-center">
                      <img
                        src={frontImage} // Replace with product.image when available
                        alt={product.name}
                        className="w-16 h-16 rounded border object-contain"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {quantity} | Size: {item.size} | Color:{" "}
                          {colorAttribute}
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold text-black">
                      ₹{Number(product.price) * quantity}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 💰 Total Amount */}
            <div className="flex justify-between pt-4 border-t font-medium text-sm">
              <span>Total Amount</span>
              <span className="font-bold text-black text-base">₹{price}</span>
            </div>

            {/* 📍 Address */}
            {addresses
              .filter((address) => address.isDefault)
              .slice(0, 1)
              .map((address, idx) => (
                <div key={idx} className="bg-gray-100 p-4 rounded-lg">
                  <div className="flex gap-2 items-start">
                    <MapPin className="text-pink-600 w-5 h-5 mt-1" />
                    <div>
                      <p className="font-medium">{address.name}</p>
                      <p className="text-sm text-gray-600 leading-tight">
                        {address.address}
                        <br />
                        {address.city} - {address.pincode}
                        <br />
                        Mobile: {address.mobile}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {/* 💳 Payment Method */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex gap-2 items-center">
                <Truck className="text-blue-600 w-5 h-5" />
                <span className="text-sm text-gray-700">
                  Payment Mode:{" "}
                  <span className="font-medium">Cash on Delivery</span>
                </span>
              </div>
            </div>

            {/* 🚀 Actions */}
            <div className="flex items-center justify-center sm:flex-row gap-4 pt-4">
              <Button variant="outline" className="w-[10rem]">
                Track Order
              </Button>
              <Button onClick={() => navigate("/")} className="w-[10rem] bg-pink-600 hover:bg-pink-700 text-white cursor-pointer">
                Continue Shopping
              </Button>
            </div>

            {/* ❓ Help Link */}
            <div className="text-sm text-center text-gray-500 mt-2 flex items-center justify-center gap-1">
              <HelpCircle className="w-4 h-4" />
              <a href="#" className="text-pink-600 hover:underline">
                Need help with your order?
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-70 bg-white/60">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}
