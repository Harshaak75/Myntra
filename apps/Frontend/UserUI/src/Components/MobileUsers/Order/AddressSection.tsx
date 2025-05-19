import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
// import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useLocation, useNavigate } from "react-router-dom";
import { Gettoken } from "@/Utiles/Gettoken";
import axios from "axios";
import { backend_url } from "../../../../config";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Checkbox } from "@/Components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
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

export default function AddressSection() {
  const [open, setOpen] = useState(false);
  const { state } = useLocation();
  const cartItems = state?.cartItems;
  const totalMRP = state?.totalMRP;
  const finalPrice = state?.finalPrice;

  const [addresses, setAddresses] = useState<AddressFormData[]>([]);

  const userid = cartItems[0].userId;

  const Items = cartItems.length;
  //   console.log(cartItems.length)

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      mobile: "",
      pincode: "",
      state: "",
      address: "",
      locality: "",
      city: "",
      typeOfAddress: "home",
      isDefault: false,
    },
  });

  const [images, setimages] = useState([]);

  const [loading, setloading] = useState(false);

  const onSubmit = async (data: AddressFormData) => {
    const token = Gettoken();
    try {
      setloading(true);
      await axios.post(
        `${backend_url}user/editAddress`,
        { data },
        {
          headers: {
            authorization: `bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setOpen(false);
      reset();
    } catch (err) {
      console.error(err);
    } finally {
      setloading(false);
    }
  };

  const getFrontImageUrl = (productAttributes: any) => {
    const frontImageAttr = productAttributes?.find(
      (attr: any) => attr.attributename === "Front Image"
    );
    return frontImageAttr?.attributevalue;
  };

  //   order fetching

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

  const handleRemove = async (id: any) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) return;

    const token = await Gettoken();

    try {
      // call your API here
      setloading(true);
      await axios.delete(`${backend_url}user/address/${id}`, {
        headers: {
          authorization: `bearer ${token}`,
        },
        withCredentials: true,
      });

      // mock remove from state
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Failed to remove address", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!open) {
      fetchAddresses();
    }
  }, [open]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white min-h-screen">
      {/* Address Section */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Select Delivery Address</h2>
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="text-pink-600 cursor-pointer"
          >
            + Add New Address
          </Button>
        </div>
        {addresses.length > 0 ? (
          <div>
            <RadioGroup
              defaultValue={
                addresses.find((a) => a.isDefault)?.id?.toString() ?? ""
              }
            >
              {addresses.map((addr) => (
                <Card key={addr.id}>
                  <CardContent className="p-4 flex gap-4 items-start">
                    <RadioGroupItem
                      value={Number(addr.id).toString()}
                      id={`addr-${addr.id}`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold capitalize">
                          {addr.name}
                        </h3>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 text-xs rounded-full uppercase">
                          {addr.typeOfAddress}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {addr.address}
                        <br />
                        {addr.locality}, {addr.city} - {addr.pincode}
                        <br />
                        {addr.state}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        Mobile: {addr.mobile}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Pay on Delivery available
                      </p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(addr.id)}
                          className="cursor-pointer"
                        >
                          REMOVE
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          //   onClick={() => handleEdit(addr)}
                          className="cursor-pointer"
                        >
                          EDIT
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
            <Button
              onClick={() => setOpen(true)}
              variant="ghost"
              className="text-pink-600 hover:underline cursor-pointer mt-5"
            >
              + Add New Address
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              No addresses found. Please add a new address.
            </p>
          </div>
        )}
      </div>

      {/* Price Details Section */}
      <div>
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="text-sm font-semibold">DELIVERY ESTIMATES</h3>
            {/* you can add may images here */}
            {cartItems.map((item: any) => {
              const product = item.product;
              const imageUrl = getFrontImageUrl(product?.productAttribute);

              return (
                // ✅ You need to return the JSX!
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={imageUrl}
                    alt="item"
                    className="w-12 h-12 rounded"
                  />
                  <p className="text-sm">
                    Estimated delivery by{" "}
                    <span className="font-semibold">20 May 2025</span>
                  </p>
                </div>
              );
            })}

            <h3 className="text-sm font-semibold">
              PRICE DETAILS ({Items} Item)
            </h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹{totalMRP}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount on MRP</span>
                <span>-₹0</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Platform Fee{" "}
                  <span className="text-pink-600 cursor-pointer">
                    Know More
                  </span>
                </span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Shipping Fee{" "}
                  <span className="text-pink-600 cursor-pointer">
                    Know More
                  </span>
                </span>
                <span className="text-green-600">FREE</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{finalPrice}</span>
              </div>
            </div>
            <Button
              className={`w-full bg-pink-600 hover:bg-pink-700 text-white ${addresses.length == 0 ? "cursor-not-allowed" : "cursor-pointer"} `}
              disabled={addresses.length == 0}
              onClick={() => navigate("/checkout/payment", {state: {cartItems, totalMRP, finalPrice, Items}})}
            >
              CONTINUE
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-screen overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>ADD NEW ADDRESS</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <Input {...field} id="name" />}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Controller
                name="mobile"
                control={control}
                render={({ field }) => <Input {...field} id="mobile" />}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm">{errors.mobile.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Controller
                  name="pincode"
                  control={control}
                  render={({ field }) => <Input {...field} id="pincode" />}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State *</Label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => <Input {...field} id="state" />}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address *</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <Input {...field} id="address" />}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="locality">Locality / Town *</Label>
              <Controller
                name="locality"
                control={control}
                render={({ field }) => <Input {...field} id="locality" />}
              />
              {errors.locality && (
                <p className="text-red-500 text-sm">
                  {errors.locality.message}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city">City / District *</Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => <Input {...field} id="city" />}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Type of Address *</Label>
              <Controller
                name="typeOfAddress"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home">Home</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="office" id="office" />
                      <Label htmlFor="office">Office</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.typeOfAddress && (
                <p className="text-red-500 text-sm">
                  {errors.typeOfAddress.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(val) => field.onChange(val)}
                    id="default"
                  />
                )}
              />
              <Label htmlFor="default">Make this my default address</Label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

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
