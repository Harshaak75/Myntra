import express from "express";

import { body } from "express-validator";
import { authenticate_Admin_User } from "../Middlewares/authenticate.admin";
import { authorizeAdmin } from "../utils/adminAuthUtils";
import { aproveProduct, deleteProduct, getEmailAdmin, getName, getSellerDetails, login_product_admin, logoutadmin, Updatestatus } from "../Controller/ProductAdmin.controller";
import { getEmail, updateProduct } from "../Controller/Seller.controller";

const productAdmin = express.Router();

// :id -> update :id -> delete

productAdmin.post("/login",[
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isString().withMessage("Password must be a string")
],login_product_admin);

productAdmin.put("/product/edit/:id", authenticate_Admin_User,authorizeAdmin("product_admin"), updateProduct);

productAdmin.delete("/product/delete/:id", authenticate_Admin_User,authorizeAdmin("product_admin"), deleteProduct);

productAdmin.get("/product/getAll", authenticate_Admin_User,authorizeAdmin("product_admin"), getSellerDetails);

productAdmin.put("/product/:id/approval",authenticate_Admin_User, authorizeAdmin("product_admin"), aproveProduct);

productAdmin.post("/get-seller-name",authenticate_Admin_User, authorizeAdmin("product_admin"), getName);

productAdmin.put("/update", authenticate_Admin_User, authorizeAdmin("product_admin"), Updatestatus);

productAdmin.get("/logoutadmin", authenticate_Admin_User, authorizeAdmin("product_admin"), logoutadmin)

productAdmin.get("/getEmail", authenticate_Admin_User, authorizeAdmin("product_admin"), getEmailAdmin)

export default productAdmin;