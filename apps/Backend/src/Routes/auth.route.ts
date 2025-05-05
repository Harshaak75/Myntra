import express from "express";
import { body } from "express-validator";
import {
  auth_the_user,
  getProfile,
  logout_user,
  verify_the_otp,
} from "../Controller/auth.controller";
import { authenticate_User } from "../Middlewares/authenticate.user";
import { authenticate_Seller } from "../Middlewares/authenticate.seller";
import { authenticate_Admin_User } from "../Middlewares/authenticate.admin";

import jwt, { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.post(
  "/send-otp",
  [
    body("email")
      .notEmpty()
      .withMessage("Enter your email address")
      .isEmail()
      .withMessage("Enter proper email address."),
  ],
  auth_the_user
);

router.post(
  "/verify-otp",
  [
    body("otp").notEmpty().withMessage("Enter the OTP. "),
  ],
  verify_the_otp
);

// router.post("/edit profile", authenticate_User, editProfile)

// router.get("/profile", authenticate_User, getProfile);

router.get("/logout", authenticate_User, logout_user)

router.get("/validate-token", authenticate_Seller, (req,res) =>{
  const newToken = res.locals.newAccessToken || null;
  console.log("newtoken",newToken)
  if (newToken) {
    res.setHeader("x-new-access-token", newToken);
  }
  res.status(200).json({ message: "Token valid" });
})

router.get("/validate-token-admin", authenticate_Admin_User, (req,res) =>{
  const newToken = res.locals.newAccessToken || null;
  console.log("newtokenhh",newToken)
  if (newToken) {
    res.setHeader("x-new-access-token", newToken);
  }
  res.status(200).json({ message: "Token valid" });
})

router.get("/getAuth" , (req, res) =>{
  const token = req.cookies.sell_access_token;
  
  if(!token){
    res.status(500).json({message: "The token not found"})
  }

  try {
    const decoded = jwt.decode(token)

    if(typeof decoded === "object" && decoded !== null){
      const {id,  isVerified } = decoded as JwtPayload & {id?: Number; isVerified?: boolean };
      // const {id} =   decoded as JwtPayload & {id?: Number}

      res.status(200).json({
        message: "Token decoded successfully",
        isVerified: isVerified ?? false,
        token,
        sellerId: id
      });
    }
    else{
      res.status(400).json({ message: "Invalid token structure" });
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    res.status(500).json({ message: "Failed to decode token" });
  }
})

export default router;
