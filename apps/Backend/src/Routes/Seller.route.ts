import express from "express";
import multer from "multer";

import { body } from "express-validator";
import {
  addProduct,
  downloadExcel,
  login_seller,
  register_seller,
  SellerProfile,
  updateProduct,
  Upload_Documats,
} from "../Controller/Seller.controller";
import { authenticate_Seller } from "../Middlewares/authenticate.seller";
import { authorizeAdmin } from "../utils/adminAuthUtils";

const SellerRoute = express.Router();

const upload = multer({ storage: multer.memoryStorage()});

// login profile

SellerRoute.post(
  "/register",
  [
    body("name").isString().withMessage("First name must be a string"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password must be a string"),
    body("phone")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be exactly 10 digits."),
  ],
  register_seller
);

SellerRoute.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password must be a string"),
  ],
  login_seller
);

SellerRoute.get("/seller_profile", authenticate_Seller, SellerProfile);

SellerRoute.post(
  "/add_product",
  authenticate_Seller,
  [
    body("name").isString().withMessage("Name must be a string").trim(),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .trim(),
    body("brand").isString().withMessage("Brand must be a string").trim(),
    body("category").isString().withMessage("Category must be a string").trim(),
    body("subCategory")
      .optional()
      .isString()
      .withMessage("Subcategory must be a string")
      .trim(),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("discount")
      .optional()
      .isInt({ min: 0, max: 100 })
      .withMessage("Discount must be a number between 0 and 100"),
    body("stock")
      .isInt({ min: 0 })
      .withMessage("Stock must be a positive integer"),
    body("sizeOptions").isArray().withMessage("Size options must be an array"),
    body("colorOptions")
      .isArray()
      .withMessage("Color options must be an array"),
    body("material")
      .optional()
      .isString()
      .withMessage("Material must be a string")
      .trim(),
    body("images").isArray().withMessage("Images must be an array of URLs"),
    body("rating")
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage("Rating must be between 0 and 5"),
    body("reviewsCount")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Reviews count must be a positive integer"),
  ],
  addProduct
);

SellerRoute.put("/product/:id", authenticate_Seller, updateProduct);

SellerRoute.post("/download_excel", [
  body("category").isString().withMessage("Category must be a string"),
],
downloadExcel);

SellerRoute.post("/upload_documents",authenticate_Seller,upload.single("file"),Upload_Documats)

export default SellerRoute;
