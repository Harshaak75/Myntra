import express from "express";

import { body } from "express-validator";
import { authenticate_User } from "../Middlewares/authenticate.user";
import { editAddress, editProfile } from "../Controller/user.controller";
import { getProfile } from "../Controller/auth.controller";

const userRouter = express.Router();

userRouter.get("/profile", authenticate_User, getProfile);

userRouter.post(
  "/editProfile",
  [
    body("Gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender"),
    body("dateofbirth")
      .isISO8601()
      .withMessage("Invalid date format (YYYY-MM-DD expected)"),
    body("alternateNumber")
      .optional()
      .isMobilePhone("any")
      .withMessage("Invalid phone number"),
    body("alternateNumberName")
      .optional()
      .isString()
      .withMessage("Alternate number name must be a string"),
  ],
  authenticate_User,
  editProfile
);

userRouter.post("/editAddress", [
  body("address")
    .isString()
    .withMessage("Address must be a string"),
  body("city")
    .isString()
    .withMessage("City must be a string"),
  body("state")
    .isString()
    .withMessage("State must be a string"),
  body("pincode")
    .isPostalCode("any")
    .withMessage("Invalid pincode"),
  body("locality")
    .optional()
    .isString()
    .withMessage("Landmark must be a string"),
  body("addressType")
    .isIn(["Home", "Work", "Other"])
    .withMessage("Invalid address type"),
], authenticate_User, editAddress);

export default userRouter;
