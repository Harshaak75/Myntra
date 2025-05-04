// LoginMobile.tsx

import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { banner } from "@/ImagesCollection";
import { setEmail } from "@/store/authSlice";
import axios from "axios";
import { backend_url } from "../../../config";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const Loginmobile = () => {
  const [email, setemail] = useState("");
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const valid_email = useSelector((state: any) => state.auth.email);

  useEffect(() => {
    if (valid_email) {
      console.log("user already logged in");
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setloading(true);

    if (!email.trim()) {
      seterror("Please enter the email");
      setloading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      seterror("Please enter a valid email address.");
      setloading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}userAuth/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(setEmail({ email }));
        navigate("/users/login/otp");
      }
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        seterror("Network Problem. Please try again");
      } else if (error.status === 429) {
        seterror("OTP request limit reached. Try again later.");
      } else if (error.status === 500) {
        seterror("Failed to send OTP");
      } else {
        console.log("something error", error);
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] flex flex-col items-center">
      {/* Top Banner Image */}
      <img
        src={banner}
        alt="Login Offer Banner"
        className="w-full object-contain max-h-[220px]"
      />

      {/* Login Box */}
      <div className="w-full max-w-md px-6 py-8 space-y-5">
        <h1 className="text-xl font-bold text-gray-800">
          Login <span className="font-medium text-gray-500">or</span> Signup
        </h1>

        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              seterror("");
              setemail(e.target.value);
            }}
            placeholder="Enter your Email"
            className="w-full"
          />
          {error && (
            <p className="text-sm font-medium text-red-500">{error}</p>
          )}
        </div>

        <p className="text-sm text-gray-700 font-medium">
          By continuing, I agree to the{" "}
          <span className="text-[#ff3f6c] font-semibold">Terms of Use</span> &{" "}
          <span className="text-[#ff3f6c] font-semibold">Privacy Policy</span>{" "}
          and I am above 18 years old.
        </p>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full h-12 bg-[#ff3f6c] text-white text-sm font-bold hover:bg-[#e73360] transition ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          CONTINUE
        </Button>

        <p className="text-sm text-gray-500 font-medium">
          Have trouble logging in?{" "}
          <a href="#" className="text-[#ff3f6c] font-bold">
            Get help
          </a>
        </p>
      </div>

      {/* Spinner */}
      {loading && (
        <div className="w-10 h-10 top-[50%] left-[40%] absolute  rounded-full bg-white flex items-center justify-center shadow-2xl border-1 p-1">
        <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      )}
    </div>
  );
};


