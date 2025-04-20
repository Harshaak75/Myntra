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

export default router;
