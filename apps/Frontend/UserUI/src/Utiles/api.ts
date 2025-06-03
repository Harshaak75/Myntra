// utils/api.ts
import axios from "axios";
import { backend_url } from "../../config";
import { getValidToken } from "./ValidateToken";
import { Gettoken } from "./Gettoken";

export const fetchProductsByCategory = async (category: string, Gender: string) => {
  // const token = await Gettoken();
  // console.log("hiiiiiiiiiiiii",token)

  console.log("categoryssssssssssssssss", category, Gender);
  const res = await axios.post(
    `${backend_url}user/by-category`,
    { usage: category, Gender: Gender },
    {
      // headers: {
      //   authorization: `Bearer ${token}`,
      //   "Cache-Control": "no-cache", // Prevent caching
      // },
      withCredentials: true,
    }
    // if cookies/token required
  );
//   console.log(res.data)
  return res.data;
};
