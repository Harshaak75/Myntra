import express from "express";

import { body } from "express-validator";
import { authenticate_User } from "../Middlewares/authenticate.user";
import { editProfile } from "../Controller/user.controller";
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

export default userRouter;
