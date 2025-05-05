import { getSupabaseClient } from "@/SupabaseClient";
import { getValidToken } from "@/Utiles/ValidateToken";
import axios from "axios";
import { backend_url } from "../../config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function PendingVerification() {
    const navigate = useNavigate();

    useEffect(() =>{

        async function fetchdata(){
            const {token, sellerId} = await getValidToken();

            if(!token){
                console.log("no token present")
                return;
            }

            try {
                const supabase = getSupabaseClient(token)
                console.log(sellerId)

                await supabase.from("Seller").select("isVerified").eq("id", sellerId).single().then(async ({data}) =>{
                    if (data?.isVerified) {
                        console.log("Seller verified ✅");
                        const response = await axios.get(`${backend_url}seller/newToken`,{withCredentials: true})
                        console.log(response)

                        if(response.status == 500){
                            console.log("the token is not generated")
                        }

                        navigate("/seller/dashboard")
                    }
                    else{
                        console.log("Seller not verifed");
                    }
                })
            } catch (error) {
                console.log(error)
            }
            
        }
        fetchdata();
    })
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Your Partner Account is Under Review</h2>
          <p className="mt-4 text-gray-600">
            Thank you for registering. Our team is reviewing your information. You'll be notified via email once your account is verified.
          </p>
          <img
            src="https://sagemailer.com/img/content/reviews-nine-bg.svg?cbh=71e13524cafca34d41d5c6d7c4a27556" // replace with a nice illustration or animation
            alt="Pending"
            className="w-48 h-auto mx-auto mt-6"
          />
        </div>
      </div>
    );
  }
  