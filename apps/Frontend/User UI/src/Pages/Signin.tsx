import axios from "axios";
import { useState } from "react";
import {backend_url} from "../../config"
import OtpVerification from "../Components/OtpVerification";

export default function Signin(){

    const [email, setEmail] = useState("");
    const [token, settoken] = useState("");
    const [otpsent, setotpsent] = useState(false)
    const [loading, setloading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault();
        // console.log("email")

        setloading(true)
        try {
            const response = await axios.post(backend_url + "/userAuth/send-otp", {email})
            // console.log(response)

            if(response.data.success){
                alert("OTP sent successfully!")
                settoken(response.data.token)
                setotpsent(true)
            }
            else{
                alert("Failed to send OTP. Try again.");
            }
        } catch (error) {
            alert("Error sending OTP.");
        }
        finally{
            setloading(false)
        }
    }
    return otpsent ? (<OtpVerification email={email} token = {token} />) 
    : (
        <div className="min-h-screen flex items-center justify-center bg-[#FDEFEA] p-4">
          <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                className="bg-[#F5F5F6] w-full p-3 rounded border focus:bg-white outline-none border-gray-300"
                placeholder="Email ID*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-sm text-gray-600 text-center">
                By continuing, I agree to the{" "}
                <a href="#" className="text-[#FF3F6C] hover:underline font-bold">
                  Terms of Use
                </a>{" "}
                &{" "}
                <a href="#" className="text-[#FF3F6C] hover:underline font-bold">
                  Privacy Policy
                </a>
              </p>
              <button
                type="submit"
                className="bg-[#FF3F6C] text-white py-2 mt-4 w-full rounded flex items-center justify-center gap-2 hover:bg-red-600 transition cursor-pointer"
              >
                {loading ? (
                    <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                ) : (
                    "Continue"
                )}
              </button>
            </form>
          </div>
        </div>
      );
}