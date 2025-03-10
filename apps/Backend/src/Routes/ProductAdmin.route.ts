import express from "express";

import { body } from "express-validator";
import { authenticate_Admin_User } from "../Middlewares/authenticate.admin";
import { authorizeAdmin } from "../utils/adminAuthUtils";

const productAdmin = express.Router();

// :id -> update :id -> delete

productAdmin.post("/addProduct",authenticate_Admin_User,authorizeAdmin("product_admin"),[
    
])

export default productAdmin;