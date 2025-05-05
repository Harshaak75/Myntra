import axios from "axios";
// const backend_url = "http://localhost:5000"; // Adjust based on your backend URL
import {backend_url}  from "../../config";

export const getValidToken = async (): Promise<{token: string | null; isVerified: boolean; sellerId: Number | null}> => {
  // let token = localStorage.getItem("authorization");
  // console.log("Token from localStorage:", token); // Debugging line

  const response = await axios.get(`${backend_url}userAuth/getauth`,{withCredentials: true})

  const token = response.data.token
  const isVerified = response.data.isVerified
  const sellerId = response.data.sellerId

  console.log("token", token)

  if (!token) {
    console.error("No token found in localStorage.");
    return { token: null, isVerified: false , sellerId: null };
  }

  try {
    const response = await axios.get(`${backend_url}userAuth/validate-token`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache", // Prevent caching
      },
      withCredentials: true,
    });

    // Check for the new token in the response header
    const newToken = response.headers["x-new-access-token"];
    console.log("New token",newToken)
    if (newToken) {
      localStorage.setItem("authorization", newToken); // Store the new token in localStorage
      return { token: newToken, isVerified, sellerId};
    }

    // If token is still valid
    return { token, isVerified , sellerId};

  } catch (err) {
    console.error("Error in validating token:", err);
    return { token: null, isVerified: false , sellerId: null};
  }
};

export const AdminValidToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("admin_authorization");
  console.log("Token from localStorage:", token); // Debugging line

  if (!token) {
    console.error("No token found in localStorage.");
    return null;
  }

  try {
    const response = await axios.get(`${backend_url}userAuth/validate-token-admin`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache", // Prevent caching
      },
      withCredentials: true,
    });

    // Check for the new token in the response header
    const newToken = response.headers["x-new-access-token"];
    console.log("New token",newToken)
    if (newToken) {
      localStorage.setItem("authorization", newToken); // Store the new token in localStorage
      return newToken;
    }

    // If token is still valid
    return token;

  } catch (err) {
    console.error("Error in validating token:", err);
    return null;
  }
};

export const getSellerIdFromToken = async (token: any): Promise<string | null> => {

  if (!token) {
    console.error("No token found in localStorage.");
    return null;
  }

  try {
    const response = await axios.get(`${backend_url}seller/get-sellerId`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache", // Prevent caching
      },
      withCredentials: true,
    });

    // Check for the new token in the response header
    
    // If token is still valid
    return response.data.sellerId;

  } catch (err) {
    console.error("Error in validating token:", err);
    return null;
  }
}
