import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Gettoken } from "@/Utiles/Gettoken";
import { backend_url } from "../../../config";
// import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { Input } from "../ui/input";

import { SidebarAccount } from "./AccountComp/SidebarAccount";
import { EmailMenu } from "./AccountComp/EmailMenu";
import { OTPMenu } from "./AccountComp/OTPMenu";
import { getValidToken } from "@/Utiles/ValidateToken";
import { setEmail } from "@/store/authSlice";

export default function AccountPage() {
  const email = useSelector((state: any) => state.auth.email);

  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date | null>(null);

  const [countryCode, setCountryCode] = useState("+91");
  const [mobileNumber, setMobileNumber] = useState("");

  const [altCountryCode, setAltCountryCode] = useState("+91");
  const [altMobileNumber, setAltMobileNumber] = useState("");
  const [altHint, setAltHint] = useState("");

  const [loading, setloading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [primaryMobileError, setPrimaryMobileError] = useState("");
  const [altMobileError, setAltMobileError] = useState("");

  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [verifyOldEmail, setVerifyOldEmail] = useState(false);

  const [showNewEmailModal, setShowNewEmailModal] = useState(false);

  const [showOTP, setshowOTP] = useState(false);
  const [timer, setTimer] = useState(0);

  const [showNewOTP, setshowNewOTP] = useState(false);

  const [error, seterror] = useState("");

  const [otpValues, setOtpValues] = useState(Array(5).fill(""));

  const [newOtpValues, setnewOtpValues] = useState(Array(5).fill(""));

  const [verifyerror, setverifyerror] = useState("");

  const [otpyerror, setotperror] = useState("");

  const [updatedemail, setupdatedemail] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (timer <= 0) return;

    console.log("i started");

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerifyOldEmail = async () => {
    setloading(true);

    try {
      const response = await axios.post(
        `${backend_url}userAuth/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowChangeEmailModal(false);
        setshowOTP(true);
        setTimer(59);
      }
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        setverifyerror("Network Problem. Please try again");
      } else if (error.status === 429) {
        setverifyerror("OTP request limit reached. Try again later.");
      } else if (error.status === 500) {
        setverifyerror("Failed to send OTP");
      } else {
        console.log("something error", error);
      }
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  // verify otp

  const handleResend = async () => {
    try {
      setloading(true);
      await axios.post(
        `${backend_url}userAuth/send-otp`,
        { email },
        { withCredentials: true }
      );
      setotperror("Sent OTP");
      setOtpValues(Array(5).fill(""));
      setTimer(59); // Reset to 5 mins (300 sec)
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleResend1 = async () => {
    try {
      setloading(true);
      await axios.post(
        `${backend_url}userAuth/send-otp`,
        { email: updatedemail },
        { withCredentials: true }
      );
      setotperror("Sent OTP");
      setOtpValues(Array(5).fill(""));
      setTimer(59); // Reset to 5 mins (300 sec)
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
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
        `${backend_url}userAuth/verify-otp2`,
        {
          otp: fullOtp,
        },
        { withCredentials: true }
      );

      if (response.status == 200) {
        // navigate("/");
        // alert("verified");
        setOtpValues(Array(5).fill(""));
        setshowOTP(false);
        setShowNewEmailModal(true);
        console.log(otpValues);
      }
    } catch (error: any) {
      // dispatch(logOut())
      if (error.code == "ERR_NETWORK") {
        setotperror("Network Problem. Please try again");
        return;
      }
      if (error.status == 400) {
        setotperror("OTP expired. Please request a new one.");
        return;
      } else if (error.status == 401) {
        setotperror("Invalid OTP");
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

    setotperror("");

    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    // Move to next input automatically
    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();

    // previous box
  };

  const handleChange1 = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    setotperror("");

    const updated1 = [...newOtpValues];
    updated1[index] = value;
    setnewOtpValues(updated1);

    console.log(updated1);

    // Move to next input automatically
    const nextInput = document.getElementById(`otp-${index + 1}`);
    if (value && nextInput) nextInput.focus();

    // previous box
  };

  const handleKeyDown1 = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && newOtpValues[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  useEffect(() => {
    const fullOtp = newOtpValues.join("");
    if (fullOtp.length === 5) {
      verifynewOtp(fullOtp); // Send to backend
    }
  }, [newOtpValues]);

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyUpdatedEmail = async () => {
    setloading(true);

    try {
      const response = await axios.post(
        `${backend_url}userAuth/send-otp`,
        { email: updatedemail },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setShowNewEmailModal(false);
        setshowNewOTP(true);
        setnewOtpValues(Array(5).fill(""));
        setTimer(59);
      }
    } catch (error: any) {
      if (error.code === "ERR_NETWORK") {
        setverifyerror("Network Problem. Please try again");
      } else if (error.status === 429) {
        setverifyerror("OTP request limit reached. Try again later.");
      } else if (error.status === 500) {
        setverifyerror("Failed to send OTP");
      } else {
        console.log("something error", error);
      }
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const mobileSchema = z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits");

  useEffect(() => {
    if (showChangeEmailModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showChangeEmailModal]);

  useEffect(() => {
    const fetchData = async () => {
      const token = await Gettoken();
      setloading(true);

      try {
        // Validate primary mobile number
        const response = await axios.get(`${backend_url}user/profile`, {
          headers: {
            authorization: `bearer ${token}`,
          },
          withCredentials: true,
        });

        const data = response.data;

        setName(data.name || "");
        setGender(data.gender || "");
        setDob(data.dateofbirth ? parseISO(data.dateofbirth) : null);
        setCountryCode(data.countryCode || "+91");
        setMobileNumber(data.phoneNumber || "");
        setAltCountryCode(data.altCountryCode || "+91");
        setAltMobileNumber(data.alternateNumber || "");
        setAltHint(data.alternateNumberName || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setloading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    setPrimaryMobileError("");
    setAltMobileError("");
    setloading(true);
    const token = await Gettoken();
    try {
      // Validate primary mobile number
      try {
        mobileSchema.parse(mobileNumber);
      } catch (err) {
        if (err instanceof z.ZodError) {
          setPrimaryMobileError(err.errors[0].message);
          setloading(false);
          return;
        }
      }

      // Validate alternate mobile number (if provided)
      if (altMobileNumber) {
        try {
          mobileSchema.parse(altMobileNumber);
        } catch (err) {
          if (err instanceof z.ZodError) {
            setAltMobileError(err.errors[0].message);
            setloading(false);
            return;
          }
        }
      }

      const response = await axios.post(
        `${backend_url}user/editProfile`,
        {
          name: name,
          Gender: gender,
          dateofbirth: dob ? format(dob, "yyyy-MM-dd") : "",
          phoneNumber: mobileNumber,
          countryCode,
          alternateNumber: altMobileNumber,
          alternateNumberName: altHint,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // toast.success("Details saved successfully");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000); // hide after 3s
        console.log("done");
      } else {
        // toast.error("Failed to save details");
        console.log("failed");
      }
    } catch (error) {
      // toast.error("An error occurred while saving");
      console.log("error");
    } finally {
      setloading(false);
    }
  };

  const verifynewOtp = async (fullOtp: any) => {
    const token = await Gettoken();
    try {
      setloading(true);
      const response = await axios.post(
        `${backend_url}userAuth/verify-otp2`,
        {
          otp: fullOtp,
        },
        { withCredentials: true }
      );

      if (response.status == 200) {
        const data1 = await axios.post(
          `${backend_url}user/updateEmail`,
          { email: updatedemail },
          {
            headers: {
              authorization: `bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(data1);

        dispatch(setEmail({ email: updatedemail }));
        setshowNewOTP(false);
        alert("updated email");
      }
    } catch (error: any) {
      // dispatch(logOut())
      if (error.code == "ERR_NETWORK") {
        setotperror("Network Problem. Please try again");
        return;
      }
      if (error.status == 400) {
        setotperror("OTP expired. Please request a new one.");
        return;
      } else if (error.status == 401) {
        setotperror("Invalid OTP");
        return;
      } else if (error.status == 500) {
        alert("Failed to verify the OTP.");
      }
      console.log("something error", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <main className="">
      <div className="border border-gray-300 p-8 rounded-sm">
        <h2 className="text-xl font-bold mb-6">Edit Details</h2>
        <hr className="mb-6" />

        <div className="grid gap-5">
          {/* Mobile Number */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Email Id*
            </label>
            <div
              className={`flex items-center border border-gray-300 bg-gray-200 rounded px-3 py-2 cursor-not-allowed`}
            >
              <input
                type="email"
                value={email}
                disabled={true}
                className={`text-gray-800 cursor-not-allowed`}
              />
              <span className="ml-2 text-green-500">✔</span>
              <button
                onClick={() => setShowChangeEmailModal(true)}
                className={`ml-auto text-sm font-semibold cursor-pointer text-[#ff3f6ce0]`}
              >
                CHANGE
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Mobile number*/}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+91"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-1/4 border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-3/4 border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <p className="mt-1 text-red-700 text-[0.8rem] font-semibold">
              {primaryMobileError}
            </p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Gender</label>
            <div className="grid grid-cols-2 border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setGender("Male")}
                className={`py-2 cursor-pointer border-r border-gray-300 ${gender === "Male" ? "bg-[#ff3f6ce0] text-white font-semibold" : "bg-white text-gray-800"}`}
              >
                Male
              </button>
              <button
                onClick={() => setGender("Female")}
                className={`py-2 cursor-pointer ${gender === "Female" ? "bg-[#ff3f6ce0] text-white font-semibold" : "bg-white text-gray-800"}`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Birthday */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Birthday</label>
            <DatePicker
              selected={dob}
              onChange={(date: Date | null) => setDob(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select your birthday"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Alternate Mobile */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Alternate Mobile Details
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+91"
                value={altCountryCode}
                onChange={(e) => setAltCountryCode(e.target.value)}
                className="w-1/4 border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={altMobileNumber}
                onChange={(e) => setAltMobileNumber(e.target.value)}
                className="w-3/4 border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <p className="mt-1 text-red-700 text-[0.8rem] font-semibold">
              {altMobileError}
            </p>
          </div>

          {/* Hint Name */}
          <div>
            <input
              type="text"
              placeholder="Hint name"
              value={altHint}
              onChange={(e) => setAltHint(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Save Button */}
          <div>
            <button
              onClick={handleSave}
              className="w-full bg-[#ff3f6ce0] text-white font-semibold py-3 rounded hover:bg-[#ff3f6ccf] cursor-pointer"
            >
              SAVE DETAILS
            </button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <div className="fixed top-10 left-[60rem] transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-slide-in-out z-50">
          Profile updated successfully!
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-70">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-2xl border-1 p-1">
            <div className="w-6 h-6 border-[3px] border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {showChangeEmailModal && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
          <EmailMenu
            email={email}
            verifyOldEmail={verifyOldEmail}
            setVerifyOldEmail={setVerifyOldEmail}
            handleVerifyOldEmail={handleVerifyOldEmail}
            loading={loading}
            verifyerror={verifyerror}
            setShowChangeEmailModal={setShowChangeEmailModal}
          />
        </div>
      )}

      {showOTP && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
          {/* OTP Content Wrapper */}
          <OTPMenu
            email={email}
            otpValues={otpValues}
            handleChange={handleChange}
            handleKeyDown={handleKeyDown}
            otpyerror={otpyerror}
            timer={timer}
            formatTime={formatTime}
            handleResend={handleResend}
            setVerifyOldEmail={setVerifyOldEmail}
            setshowOTP={setshowOTP}
            setTimer={setTimer}
          />
        </div>
      )}

      {showNewEmailModal && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Update Email Id</h2>

            {/* Step 1: Old Email with Radio Button */}
            <div className="border border-gray-300 rounded flex items-center gap-3 mb-4">
              <input
                type="text"
                id="update-email"
                name="new email"
                onChange={(e) => setupdatedemail(e.target.value)}
                value={updatedemail}
                placeholder="Enter new email"
                className="accent-[#ff3f6ce0] w-full p-2"
              />
            </div>

            <button
              onClick={verifyUpdatedEmail}
              className={`w-full py-2 text-white text-[0.9rem] rounded font-semibold ${loading} > "cursor-not-allowed" : "cursor-pointer" bg-[#ff3f6ce0] hover:bg-[#ff3f6cc5] cursor-pointer
                `}
            >
              Verify
            </button>

            <p className="mt-1 text-[0.8rem] text-red-800 font-semibold">
              {verifyerror}
            </p>

            <button
              onClick={() => {
                setShowNewEmailModal(false);
              }}
              className="mt-4 text-gray-500 text-sm underline block text-center cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showNewOTP && (
        <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
          <OTPMenu
            email={updatedemail}
            otpValues={newOtpValues}
            handleChange={handleChange1}
            handleKeyDown={handleKeyDown1}
            otpyerror={otpyerror}
            timer={timer}
            formatTime={formatTime}
            handleResend={handleResend1}
            setshowOTP={setshowNewOTP}
            setupdatedemail={setupdatedemail}
            setTimer={setTimer}
          />
        </div>
      )}
    </main>
  );
}
