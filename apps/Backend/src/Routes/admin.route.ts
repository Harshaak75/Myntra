import express from "express";

import { body } from "express-validator";
import {
  createAdmin,
  createSuperAdmin,
  getAdmin,
  loginAdmin,
} from "../Controller/admin.controller";
import { authenticate_Admin_User } from "../Middlewares/authenticate.admin";
import { authorizeAdmin } from "../utils/adminAuthUtils";

const adminRouter = express.Router();

adminRouter.post(
  "/admin_login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password must be a string"),
  ],
  loginAdmin
);

adminRouter.post(
  "/create_super_admin",
  [
    body("name").isString().withMessage("First name must be a string"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password must be a string"),
  ],
  createSuperAdmin
);

adminRouter.post(
  "/create_admin",
  [
    body("name").isString().withMessage("First name must be a string"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password must be a string"),
    body("role")
      .isIn(["product_admin", "order_admin"])
      .withMessage("Invalid role"),
  ],
  authenticate_Admin_User,
  authorizeAdmin("super_admin"),
  createAdmin
);

adminRouter.get(
  "/get_all_admin",
  authenticate_Admin_User,
  authorizeAdmin("super_admin"),
  getAdmin
);

export default adminRouter;
