// utils/api.ts
import axios from "axios";
import { backend_url } from "../../config";
import { getValidToken } from "./ValidateToken";

export const fetchProductsByCategory = async (category: string) => {
  const { token } = await getValidToken();
  const res = await axios.post(
    `${backend_url}seller/by-category`,
    { usage: category },
    {
      headers: {
        authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache", // Prevent caching
      },
      withCredentials: true,
    }
    // if cookies/token required
  );
//   console.log(res.data)
  return res.data;
};
