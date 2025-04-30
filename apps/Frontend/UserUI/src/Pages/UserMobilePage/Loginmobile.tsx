// LoginMobile.tsx

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { banner } from "@/ImagesCollection";
import { setEmail } from "@/store/authSlice";
import axios from "axios";
import { backend_url } from "../../../config";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Loginmobile = () => {
    const [email , setemail] = useState("");

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [error, seterror] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
        if (!email.trim()) {
          // alert("Please enter your email.");
          seterror("Please enter the email")
          return;
        }
      
        if (!emailRegex.test(email)) {
          // alert("Please enter a valid email address.");
          seterror("Please enter a valid email address.")
          return;
        }
      
        // Valid email — continue flow
        try {
          const response = await axios.post(`${backend_url}userAuth/send-otp`,{
            email: email},
            {withCredentials: true}
          );

          if(response.status == 200){
            console.log(email)
            dispatch(setEmail({email : email}));
            navigate("/users/login/otp")
          }
        } catch (error: any) {
          if(error.code == "ERR_NETWORK"){
            seterror("Network Problem. Please try again")
            return;
          }
          else if(error.status == 429){
            seterror("OTP request limit reached. Try again later.")
            return;
          }
          else if(error.status == 500){
            seterror("Failed to send OTP")
            return;
          }
          console.log("something error", error)
        }
      };


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Logo or Illustration */}
      <div className="">
        <img
          src={banner} // Replace with your image path
          alt="Login Illustration"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm space-y-4 p-7">
        <h1 className="text-[1.3rem] font-bold text-gray-800 font-mono ">Login<span className="font-medium text-gray-500 px-1">or</span>Signup</h1>

        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              seterror("")
              setemail(e.target.value)
            }}
            placeholder="Enter you Email"
            className="w-full"
          />
          {error && <p className="text-[0.8rem] font-semibold text-red-500">{error}</p>}
        </div>
        
        <div className="text-[0.9rem] font-semibold text-gray-600">
            <p>By continuing, I agree to the <span className="text-[#ff3f6ce0]">Terms of Use</span> & <span className="text-[#ff3f6ce0]">Privacy Policy.</span></p>
        </div>

        <Button onClick={handleSubmit} className=" w-full bg-[#ff3f6ce0] h-[3rem] text-white py-3 text-[0.9rem] font-semibold hover:bg-[#ff3f6cb1] transition">
          CONTINUE
        </Button>

        <p className="text-sm text-gray-500 font-semibold mt-3">
          Have trouble logging in? <a href="#" className="text-[#ff3f6ce0] font-bold">Get help</a>
        </p>
      </div>
    </div>
  );
};
