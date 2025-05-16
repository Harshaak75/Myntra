"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Checkbox } from "@/Components/ui/checkbox";
import { MapPinHouse } from "lucide-react";
import axios from "axios";
import { Gettoken } from "@/Utiles/Gettoken";
import { backend_url } from "../../../config";
import { useNavigate } from "react-router-dom";

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

export function Address() {
  const [open, setOpen] = useState(false);

  const [loading, setloading] = useState(false);

  const [addresses, setAddresses] = useState<AddressFormData[]>([]);

  const navigate = useNavigate();

  const fetchAddresses = async () => {
    setloading(true)
    const token = Gettoken();
    try {
      const res = await axios.get(`${backend_url}user/getAddresses`, {
        headers: {
          authorization: `bearer ${token}`,
        },
        withCredentials: true,
      });
      setAddresses(res.data.addresses || []);
      console.log(addresses)
    } catch (err: any) {
      if(err.status === 403 && err.response.data.message === "Invalid token"){
        navigate("/users/login")
      }
      console.error("Error fetching addresses:", err);
    }
    finally{
        setloading(false)
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

  const handleRemove = async (id:any) =>{
    const confirmDelete = window.confirm("Are you sure you want to delete this address?")

    if (!confirmDelete) return;

    const token = await Gettoken();

    try {
      // call your API here
      await axios.delete(`${backend_url}user/address/${id}`,{
        headers:{
            authorization: `bearer ${token}`
        },
        withCredentials: true
      });

      // mock remove from state
      setAddresses(prev => prev.filter(address => address.id !== id));
    } catch (error) {
      console.error("Failed to remove address", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
<div className="bg-white min-h-screen px-0 sm:px-6 lg:px-8 py-6">
  {addresses.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 sm:p-10">
      <MapPinHouse className="w-28 h-14 sm:w-40 sm:h-20 mb-4 text-indigo-500" />
      <h2 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">SAVE YOUR ADDRESSES NOW</h2>
      <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6 max-w-md">
        Add your home and office addresses and enjoy faster checkout
      </p>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-indigo-500 text-indigo-500 text-sm"
      >
        + ADD NEW ADDRESS
      </Button>
    </div>
  ) : (
    <>
<div className="flex items-center sm:flex-row sm:justify-between mb-4 gap-2">
  <h2 className="text-center md:block hidden sm:text-left text-base sm:text-lg font-semibold">
    Your Saved Addresses
  </h2>
  <Button
    variant="outline"
    onClick={() => setOpen(true)}
    className="border-indigo-500 text-indigo-500 text-sm px-3 py-1"
  >
    + Add Address
  </Button>
</div>


<div className="grid gap-4">
  {addresses.map((addr, idx) => (
    <div
      key={idx}
      className="w-full border md:rounded-xl rounded-none p-4 bg-white shadow-sm text-sm"
    >
      <div className="space-y-1">
        <p className="font-semibold capitalize">{addr.name}</p>
        <p>{addr.address}</p>
        <p>{addr.locality}</p>
        <p>
          {addr.city} - {addr.pincode}
        </p>
        <p className="uppercase">{addr.state}</p>
        <p className="text-sm mt-1">Mobile: {addr.mobile}</p>
      </div>

      {addr.isDefault && (
        <span className="inline-block bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-full mt-2">
          DEFAULT
        </span>
      )}

      <div className="mt-4 grid grid-cols-2 text-center text-indigo-600 font-medium text-sm border-t divide-x">
        <button className="py-2 hover:bg-gray-50">EDIT</button>
        <button className="py-2 hover:bg-gray-50" onClick={() => handleRemove(addr.id)}>
          REMOVE
        </button>
      </div>
    </div>
  ))}
</div>

    </>
  )}

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
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile *</Label>
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => <Input {...field} id="mobile" />}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="pincode">Pincode *</Label>
            <Controller
              name="pincode"
              control={control}
              render={({ field }) => <Input {...field} id="pincode" />}
            />
            {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="state">State *</Label>
            <Controller
              name="state"
              control={control}
              render={({ field }) => <Input {...field} id="state" />}
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address *</Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input {...field} id="address" />}
          />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="locality">Locality / Town *</Label>
          <Controller
            name="locality"
            control={control}
            render={({ field }) => <Input {...field} id="locality" />}
          />
          {errors.locality && <p className="text-red-500 text-sm">{errors.locality.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="city">City / District *</Label>
          <Controller
            name="city"
            control={control}
            render={({ field }) => <Input {...field} id="city" />}
          />
          {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
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
          {errors.typeOfAddress && <p className="text-red-500 text-sm">{errors.typeOfAddress.message}</p>}
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
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>

  {loading && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/60">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl p-1">
        <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  )}
</div>
  );
}
