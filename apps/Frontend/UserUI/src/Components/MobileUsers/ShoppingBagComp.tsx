import React, { useEffect, useState } from "react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { BadgePercent, ShieldCheck, Tag } from "lucide-react";
import axios from "axios";
import { backend_url } from "../../../config";
import { Gettoken } from "@/Utiles/Gettoken";
import { logo } from "@/ImagesCollection";
import { useNavigate } from "react-router-dom";

interface ProductAttribute {
  attributename: string;
  attributevalue: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  productAttribute: ProductAttribute[];
}

interface CartItem {
  id: number;
  product: Product;
  size: string;
  quantity: number;
  selected: boolean; // NEW
}

const ShoppingBagComp = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [pincode, setpincode] = useState("");

  const [showSuccess, setshowSuccess] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      const token = await Gettoken();
      try {
        const res = await axios.get(`${backend_url}user/cart`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = res.data; // ✅ CORRECT
        setCartItems(
          data.response.map((item: CartItem) => ({
            ...item,
            selected: true, // default selected
          }))
        );
        console.log(data);
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const selectedItems = cartItems.filter((item) => item.selected);

  const totalMRP = selectedItems.reduce(
    (sum, item) =>
      sum + (Number(item.product.originalPrice) || Number(item.product.price)),
    0
  );
  console.log(totalMRP);
  const totalDiscount = selectedItems.reduce((sum, item) => {
    const discount =
      (item.product.originalPrice || item.product.price) - item.product.price;
    return sum + discount;
  }, 0);
  console.log(totalDiscount);
  const finalPrice = totalMRP - totalDiscount;

  const handleRemove = async (id: any) => {
    const token = await Gettoken();

    try {
      setLoading(true);
      await axios.delete(`${backend_url}user/delete/cartItem/${id}`, {
        headers: {
          authorization: `bearer ${token}`,
        },
        withCredentials: true,
      });

      setCartItems((prev) => prev.filter((item) => item.id !== id));

      setshowSuccess(true)

      setTimeout(() => setshowSuccess(false), 2000)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-10">
      {/* Top Navbar */}
      <div className="flex items-center justify-between border-b pb-4">
        <img
          src={logo}
          alt="Logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <div className="flex items-center gap-6 text-sm font-medium">
          <span className="text-green-600">BAG</span>
          <span className="text-gray-400">ADDRESS</span>
          <span className="text-gray-400">PAYMENT</span>
        </div>
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <ShieldCheck />
          <span>100% SECURE</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Items and Offers */}
        <div className="md:col-span-2 space-y-4">
          <Card className="p-4">
            <Label>Check delivery time & services</Label>
            <div className="flex mt-2 gap-2">
              <Input
                onChange={(e) => setpincode(e.target.value)}
                value={pincode}
                placeholder="Enter PIN code"
                className="w-1/2"
              />
              <Button className="cursor-pointer">Enter</Button>
            </div>
          </Card>

          <Card className="p-4">
            <Label>
              <BadgePercent className="w-[1.2rem]" /> Available Offers
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              10% Instant Discount on Canara Bank Credit Cards on a min spend of
              ₹3,500.
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold">
              {cartItems.filter((item) => item.selected).length}/
              {cartItems.length} ITEMS SELECTED
            </h3>

            {cartItems.map((item) => {
              const frontImage =
                item.product.productAttribute.find(
                  (a) => a.attributename === "Front Image"
                )?.attributevalue || "";

              return (
                <div
                  key={item.id}
                  className="flex relative gap-4 mt-4 border-t pt-4"
                >
                  <button
                    onClick={() => handleRemove(item.id)} // Define this function
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors text-sm cursor-pointer"
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                  <Checkbox
                    className="cursor-pointer"
                    checked={item.selected}
                    onCheckedChange={(checked) => {
                      const updated = [...cartItems];
                      const index = updated.findIndex((i) => i.id === item.id);
                      updated[index].selected = Boolean(checked);

                      // Reorder: selected items on top
                      updated.sort((a, b) =>
                        a.selected === b.selected ? 0 : a.selected ? -1 : 1
                      );

                      setCartItems(updated);
                    }}
                  />
                  <img
                    src={frontImage}
                    alt="product"
                    className="w-20 h-24 object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Qty: {item.quantity}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Delivery by Tomorrow
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold mt-5">
                      ₹{item.product.price}{" "}
                      {item.product.originalPrice && (
                        <span className="line-through text-gray-400 text-sm ml-1">
                          ₹{item.product.originalPrice}
                        </span>
                      )}
                    </p>
                    {item.product.discount && (
                      <p className="text-sm text-red-600">
                        {item.product.discount} OFF
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        {/* Right Side - Summary and Options */}
        <div className="space-y-4">
          <Card className="p-4">
            <Label>
              <Tag className="w-[1rem]" /> Apply Coupons
            </Label>
            <div className="flex mt-2 gap-2">
              <Input placeholder="Apply Coupons" />
              <Button className="cursor-pointer">Apply</Button>
            </div>
          </Card>

          <Card className="p-4">
            <Label>Gifting & Personalisation</Label>
            <div className="mt-2 p-2 bg-pink-50 rounded">
              <p className="text-sm font-medium">Buying for a loved one?</p>
              <p className="text-xs text-gray-600">
                Gift Packaging and personalised message on card, Only for ₹35
              </p>
              <Button className="mt-2 text-xs cursor-pointer">
                Add Gift Package
              </Button>
            </div>
          </Card>

          <Card className="p-4">
            <Label>Support Transformative Social Work in India</Label>
            <div className="mt-2">
              <Checkbox /> Donate and make a difference
            </div>
            <div className="flex gap-2 mt-2">
              {[10, 20, 50, 100].map((amt) => (
                <Button
                  key={amt}
                  variant="outline"
                  className="text-xs cursor-pointer"
                >
                  ₹{amt}
                </Button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h4 className="font-semibold mb-2">
              Price Details ({cartItems.length} Items)
            </h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount on MRP</span>
                <span>-₹{totalDiscount}</span>
              </div>
              <div className="flex justify-between">
                <span>Coupon Discount</span>
                <span className="text-pink-600">Apply Coupon</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{finalPrice}</span>
            </div>
            <Button className="w-full mt-4 cursor-pointer">Place Order</Button>
          </Card>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
          <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed top-10 left-[60rem] transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-slide-in-out z-50">
          Item removed from the bag
        </div>
      )}
    </div>
  );
};

export default ShoppingBagComp;
