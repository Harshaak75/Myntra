"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { background, logo } from "@/ImagesCollection";
import { useState } from "react";
import axios from "axios";
import { backend_url } from "../../../config";
import { AdminValidToken } from "@/Utiles/ValidateToken";
import { useNavigate } from "react-router-dom";

export default function ProductLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setloading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent page reload

    if (!formData.email || !formData.password) {
      alert("All fields are required! Please fill out the entire form.");
      return;
    }

    // const token = await AdminValidToken();

    setloading(true); // Show loading state

    try {
      const response = await axios.post(
        `${backend_url}ProductAdmin/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // ✅ Enables cookies to be stored
        }
      );

      if (response.status === 200) {
        localStorage.setItem("admin_authorization", response.data.ProductAdmintoken); // Save token
        console.log(response.data);
        alert("Registration successful!");
        navigate("/productAdmin/dashboard");
      } else {
        navigate("/productAdmin/login");
        alert("Failed to register. Please try again later.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
    finally{
      setloading(false); // Hide loading state
    }
  };
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gray-100 px-4 bg-cover"
      style={{ backgroundImage: `url(${background})` }}
    >
      <Card className="w-full max-w-md shadow-md rounded-2xl">
        <CardHeader>
          <div className="flex justify-center -mt-12">
            <div className="flex items-center justify-center w-24 h-24">
              <img src={logo} alt="Logo" className="w-14 pt-8" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CardTitle className="text-xl text-center font-semibold">
              Welcome back to Mynstars !
            </CardTitle>
            <p className="text-sm text-gray-500">
              Oversee. Approve. Elevate Mynstars
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="********"
                  required
                />
              </div>

              <Button
                type="submit"
                className={`w-full text-md ${loading ? "cursor-not-allowed" : "cursor-pointer"} bg-[#FF3F6C] hover:bg-[#ff3f6cda]`}
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
