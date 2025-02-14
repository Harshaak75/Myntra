import express from "express";
import { body } from "express-validator";
import {
  auth_the_user,
  protect_my_route,
  verify_the_otp,
} from "../Controller/auth.controller";
import { authenticate_User } from "../Middlewares/authenticate.user";

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
    body("email")
      .notEmpty()
      .withMessage("Enter your email address")
      .isEmail()
      .withMessage("Enter proper email address."),
    body("otp").notEmpty().withMessage("Enter the OTP. "),
  ],
  verify_the_otp
);

router.get("/protected", authenticate_User, protect_my_route);

export default router;
