"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Gettoken } from "@/Utiles/Gettoken";
import axios from "axios";
import { backend_url } from "../../../../config";

const paymentOptions = [
  { label: "Cash On Delivery", value: "cod" },
  { label: "UPI (Pay via any App)", value: "upi" },
  { label: "Credit/Debit Card", value: "card" },
  //   { label: "Pay in 3", value: "emi" },
  { label: "Pay Later", value: "later" },
  { label: "Wallets", value: "wallet" },
  { label: "EMI", value: "full_emi" },
  { label: "Net Banking", value: "netbanking" },
];

export default function PaymentOption() {
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const { state } = useLocation();

  const cartitems = state?.cartItems;

  const totalprice = state?.totalMRP;
  const finalprice = state?.finalPrice;

  const items = cartitems?.length || 0;

  const navigate = useNavigate();

  const [loading, setloading] = useState(false);

  const placeOrder = async () => {
    const token = Gettoken();

    try {
      setloading(true);
      const response = await axios.post(
        `${backend_url}user/order`,
        { cartitems }, // Request body
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const order = response.data.order_created;

      navigate("/user/orderPage", { state: { cartitems, order, finalprice } });
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Left: Payment Methods */}
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose Payment Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue="cod"
              onValueChange={setSelectedPayment}
              className="space-y-4"
            >
              {paymentOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-between border rounded-lg px-4 py-2 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <label
                      htmlFor={option.value}
                      className="text-sm cursor-pointer"
                    >
                      {option.label}
                    </label>
                    {option.value === "card" && (
                      <span className="text-xs text-green-600">4 Offers</span>
                    )}
                    {option.value === "emi" && (
                      <span className="text-xs bg-pink-100 text-pink-600 rounded-full px-2 py-0.5">
                        NEW
                      </span>
                    )}
                    {option.value === "wallet" && (
                      <span className="text-xs text-green-600">1 Offer</span>
                    )}
                    {option.value === "netbanking" && (
                      <span className="text-xs text-green-600">1 Offer</span>
                    )}
                  </div>
                </div>
              ))}
            </RadioGroup>

            {/* Only show Place Order if "cod" is selected */}
            {selectedPayment === "cod" && (
              <div className="text-center mt-6">
                <Button
                  onClick={placeOrder}
                  className={`bg-pink-600 hover:bg-pink-700 text-white ${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={loading}
                >
                  Place Order
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  You can pay via Cash/UPI on delivery.
                </p>
              </div>
            )}

            {selectedPayment !== "cod" && (
              <p className="text-center text-sm mt-6 text-gray-500 italic">
                This payment method will be available soon.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Order Summary */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              PRICE DETAILS ({items} Items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total MRP</span>
              <span>₹{totalprice}</span>
            </div>
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount on MRP</span>
              <span>-₹0</span>
            </div>
            <div className="flex justify-between">
              <span>
                Platform Fee{" "}
                <span className="text-pink-600 cursor-pointer">Know More</span>
              </span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between">
              <span>
                Shipping Fee{" "}
                <span className="text-pink-600 cursor-pointer">Know More</span>
              </span>
              <span className="text-green-600">FREE</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-black">
              <span>Total Amount</span>
              <span>₹{finalprice}</span>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 text-green-700 flex items-center text-sm gap-2">
          <BadgeCheck className="w-4 h-4" /> 100% SECURE
        </div>
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
