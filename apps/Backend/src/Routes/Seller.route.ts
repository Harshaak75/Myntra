import express from "express";
import multer from "multer";

import { body } from "express-validator";
import {
  addCoverId,
  checkSeller,
  // addProduct,
  downloadExcel,
  GeneratePicklist,
  getData,
  getEmail,
  getPicklistDetails,
  getProductDetails,
  getQuantity,
  login_seller,
  logoutSeller,
  register_seller,
  SellerProfile,
  updateProduct,
  updateSeller,
  updateSellerShopDetails,
  Upload_Documats,
  validateSKU,
} from "../Controller/Seller.controller";
import { authenticate_Seller } from "../Middlewares/authenticate.seller";
import { authorizeAdmin } from "../utils/adminAuthUtils";
import { getOrderDetails } from "../Controller/user.controller";

import jwt, { JwtPayload } from "jsonwebtoken";
import { generateTokensSeller } from "../utils/tokenUtils";
import { secure_cookie } from "../config";

const SellerRoute = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

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

// add product is removed for now

// SellerRoute.post(
//   "/add_product",
//   authenticate_Seller,
//   [
//     body("name").isString().withMessage("Name must be a string").trim(),
//     body("description")
//       .optional()
//       .isString()
//       .withMessage("Description must be a string")
//       .trim(),
//     body("brand").isString().withMessage("Brand must be a string").trim(),
//     body("category").isString().withMessage("Category must be a string").trim(),
//     body("subCategory")
//       .optional()
//       .isString()
//       .withMessage("Subcategory must be a string")
//       .trim(),
//     body("price")
//       .isFloat({ min: 0 })
//       .withMessage("Price must be a positive number"),
//     body("discount")
//       .optional()
//       .isInt({ min: 0, max: 100 })
//       .withMessage("Discount must be a number between 0 and 100"),
//     body("stock")
//       .isInt({ min: 0 })
//       .withMessage("Stock must be a positive integer"),
//     body("sizeOptions").isArray().withMessage("Size options must be an array"),
//     body("colorOptions")
//       .isArray()
//       .withMessage("Color options must be an array"),
//     body("material")
//       .optional()
//       .isString()
//       .withMessage("Material must be a string")
//       .trim(),
//     body("images").isArray().withMessage("Images must be an array of URLs"),
//     body("rating")
//       .optional()
//       .isFloat({ min: 0, max: 5 })
//       .withMessage("Rating must be between 0 and 5"),
//     body("reviewsCount")
//       .optional()
//       .isInt({ min: 0 })
//       .withMessage("Reviews count must be a positive integer"),
//   ],
//   addProduct
// );

SellerRoute.put("/product/:id", authenticate_Seller, updateProduct);

SellerRoute.post(
  "/download_excel",
  [body("category").isString().withMessage("Category must be a string")],
  authenticate_Seller,
  downloadExcel
);

SellerRoute.post("/updateSeller", authenticate_Seller, updateSeller);

SellerRoute.post(
  "/updatesellershop",
  authenticate_Seller,
  updateSellerShopDetails
);

SellerRoute.post(
  "/upload_documents",
  authenticate_Seller,
  upload.single("file"),
  Upload_Documats
);

SellerRoute.get("/logoutSeller", authenticate_Seller, logoutSeller);

SellerRoute.get("/auth/check", authenticate_Seller, checkSeller);

SellerRoute.get("/email", authenticate_Seller, getEmail);

SellerRoute.post("/generatePicklist", authenticate_Seller, GeneratePicklist);

SellerRoute.post("/getOrderDetails", authenticate_Seller, getProductDetails);

SellerRoute.get("/getQuantity", authenticate_Seller, getQuantity);

SellerRoute.post(
  "/getPicklistDetails",
  authenticate_Seller,
  getPicklistDetails
);

SellerRoute.post("/validateSKU", authenticate_Seller, validateSKU);

SellerRoute.post("/addCoverId", authenticate_Seller, addCoverId);

SellerRoute.get("/get-sellerId", authenticate_Seller, (req, res) => {
  console.log("Seller ID:", req.seller_id); // Log the seller ID
  res.status(200).json({ sellerId: req.seller_id }); // Send the seller ID in the response
});

SellerRoute.get("/newToken", async (req, res) => {
  const token = req.cookies.sell_access_token;

  console.log("tooo", token)

  try {
    const decoded = jwt.decode(token);

    console.log("HI")

    if (typeof decoded === "object" && decoded !== null) {
      console.log("HI")
      const { id } = decoded as JwtPayload & { id?: Number };
      console.log(id)

      const accessToken = await generateTokensSeller(id);

      console.log("HI")

      console.log("tooooo", accessToken)

      res.cookie("sell_access_token", accessToken, {
        httpOnly: true,
        secure: secure_cookie == "Production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: secure_cookie == "Production" ? "none" : "lax",
      });

      res.status(200).json({message: "done"})
    }
  } catch (error) {
    res.status(500).json({error})
  }
});

SellerRoute.post("/by-category", authenticate_Seller, getData)

export default SellerRoute;
