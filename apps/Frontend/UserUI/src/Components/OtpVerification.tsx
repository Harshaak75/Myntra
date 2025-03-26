import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backend_url } from "../../config";

interface OtpProps {
  email: string;
  token: string;
}

export default function OtpVerification({ email, token }: OtpProps) {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setloading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Allow only one digit
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 5) {
      alert("Please enter a valid 5-digit OTP.");
      return;
    }
    setloading(true);

    try {
      const response = await axios.post(
        backend_url + "/userAuth/verify-otp",
        {
          otp: enteredOtp,
        },
        {
          headers: {
            authorization: `bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("OTP Verified! Redirecting...");
        // Redirect user or update state
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      alert("Error verifying OTP. Please try again.");
    } finally {
      setloading(false);
    }
  };

  const resendOtp = async () => {
    setloading(true);
    try {
      const response = await axios.post(backend_url + "/userAuth/send-otp", {
        email,
      });

      if (response.data.success) {
        alert("New OTP sent! Timer restarted.");
        setTimer(300); // Reset timer to 5 minutes
        setResendDisabled(true);
      }
    } catch (error) {
      alert("Failed to resend OTP. Try again later.");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-xl font-semibold text-center mb-4">
          Enter OTP Sent to {email}
        </h2>
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((num, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              className="w-10 h-10 text-center text-xl border rounded-md focus:outline-none"
              value={num}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        <p className="text-gray-600 text-center">
          Resend OTP in:{" "}
          <span className="font-bold">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
          </span>
        </p>
        <button
          onClick={handleSubmit}
          className="bg-[#FF3F6C] text-white py-2 mt-4 w-full rounded flex items-center justify-center gap-2 hover:bg-red-600 transition cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
          ) : (
            "Verify OTP"
          )}
        </button>
        <button
          onClick={resendOtp}
          disabled={resendDisabled}
          className={`w-full py-2 mt-2 rounded ${
            resendDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}
