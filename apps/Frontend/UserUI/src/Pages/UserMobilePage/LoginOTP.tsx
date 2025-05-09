import { useEffect, useState } from "react";
import { Button } from "@/Components/Button";
import { Input } from "@/Components/ui/input";
import { otp } from "@/ImagesCollection";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { backend_url } from "../../../config";
import { logOut, setEmail } from "@/store/authSlice";

export const LoginOTP = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const email = useSelector((state: any) => state.auth.email);

  const [otpValues, setOtpValues] = useState(Array(5).fill(""));

  const [timer, setTimer] = useState(59); // 5 minutes in seconds

  const [error, seterror] = useState("");

  const [loading, setloading] = useState(false);

  // Start countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    // const prevInput = document.getElementById(`otp-${0}`);
    // prevInput?.focus();

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      setloading(true);
      await axios.post(
        `${backend_url}userAuth/send-otp`,
        { email },
        { withCredentials: true }
      );
      seterror("Sent OTP");
      setOtpValues(Array(5).fill(""));
      setTimer(59); // Reset to 5 mins (300 sec)
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  // Format timer as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    const firstInput = document.getElementById("otp-0");
    firstInput?.focus();
  }, []);
  

  useEffect(() => {
    const fullOtp = otpValues.join("");
    if (fullOtp.length === 5) {
      verifyOtp(fullOtp); // Send to backend
    }
  }, [otpValues]);

  const verifyOtp = async (fullOtp: any) => {
    // console.log(fullOtp,typeof(fullOtp))

    try {
      setloading(true);
      const response = await axios.post(
        `${backend_url}userAuth/verify-otp`,
        {
          otp: fullOtp,
        },
        { withCredentials: true }
      );

      if (response.status == 200) {
        setOtpValues(Array(5).fill(""));
        alert("verified")
        navigate("/");
      }
    } catch (error: any) {
      dispatch(logOut())
      if (error.code == "ERR_NETWORK") {
        seterror("Network Problem. Please try again");
        return;
      }
      if (error.status == 400) {
        seterror("OTP expired. Please request a new one.");
        return;
      } else if (error.status == 401) {
        seterror("Invalid OTP");
        return;
      } else if (error.status == 500) {
        alert("Failed to verify the OTP.");
      }
      console.log("something error", error);
    } finally {
      setloading(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    seterror("");

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    // Move to next input automatically
    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();

    // previous box
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row md:items-center md:justify-center relative p-4">
      {/* Back Arrow */}
      <div className="md:absolute md:top-5 md:left-5 md:z-10 text-gray-700 cursor-pointer">
        <ArrowLeft
          onClick={() => {
            dispatch(logOut())
            navigate("/users/login")
          }}
          className="w-5 h-5"
        />
      </div>

      {/* OTP Content Wrapper */}
      <div className="flex flex-col md:items-center md:justify-center">
        {/* Image */}
        <div className="w-30 h-30 ml-10 md:ml-0">
          <img
            src={otp}
            alt="Login Illustration"
            className="w-full h-full object-contain"
          />
        </div>

        {/* OTP Form */}
        <div className="w-full max-w-sm p-7">
          <h1 className="text-[1.3rem] font-bold text-gray-600 font-sans">
            Verify with OTP
          </h1>
          <p className="text-[0.8rem] text-gray-400 font-semibold">
            Sent to {email}
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-between space-x-2 mt-7">
            {otpValues.map((value, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                value={value}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center text-lg font-medium border-gray-300 focus-visible:ring-1 focus-visible:ring-[#ff3f6ce0]"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
            ))}
          </div>
          {error && (
            <p className="text-red-500 font-semibold text-[0.8rem] mt-3">
              {error}
            </p>
          )}
          <div className="text-[0.9rem] font-semibold text-gray-600 mt-4">
            {timer > 0 ? (
              <p className="text-sm text-gray-400">
                Resend OTP in {formatTime(timer)}
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-[#ff3f6ce0] font-bold cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 font-semibold mt-6">
            Have trouble logging in?{" "}
            <a href="#" className="text-[#ff3f6ce0] font-bold">
              Get help
            </a>
          </p>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl border-1 p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
};
