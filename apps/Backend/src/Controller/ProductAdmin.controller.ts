import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  approve_product,
  delete_product,
  getSellerdata,
  login_productAdmin,
} from "../Services/ProductAdmin.services";
import { secure_cookie } from "../config";
import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();

export const login_product_admin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const data = req.body;

    console.log("data", data);

    const productAdmin_login = await login_productAdmin(data.email, data.password);

    console.log("productAdmin_login", productAdmin_login);

    res.cookie("admin_access_token", productAdmin_login.accessToken, {
      httpOnly: true,
      path: "/",
      secure: secure_cookie === "Production",
      sameSite: secure_cookie == "Production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({
      message: "Logged In Successfully",
      ProductAdmintoken: productAdmin_login.accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "server error: error in login product admin",
        error: error,
      });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const productId = req.params;

    console.log(productId.id);

    if (!productId) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const deletedProduct = await delete_product(productId.id);

    if (!deletedProduct) {
      return res.status(400).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
};

export const getSellerDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const seller_details = await getSellerdata();

    if (!seller_details) {
      return res.status(400).json({ message: "Seller data not found" });
    }

    return res.status(200).json({ message: "Seller data", seller_details });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting seller data", error });
  }
};

export const aproveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const product_id = req.params.id;

    const { approve } = req.body;

    if (typeof approve !== "boolean") {
      return res.status(400).json({ message: "Approve must be a boolean" });
    }

    if (!product_id) {
      return res.status(400).json({ message: "Product id is required" });
    }

    const product = await approve_product(product_id, approve);

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product approved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error approving product", error });
  }
};


export const getName = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  try {
    const ids = req.body;

  const data = await Client.seller.findMany({
    where: {
      id: {
        in: ids.uniqueIds,
      },
    },
    select: {
      id: true,
      firstname: true,
    },
  })
  console.log("Data fetched successfully:", data);
  return res.status(200).json({ message: "Data fetched successfully", data });
  } catch (error) {
    console.log(error)
  }
}

export const Updatestatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  try {
    const { productId, newStatus } = req.body;

    const statusString = newStatus.toString();

    const data = await Client.product.update({
      where: {
        id: Number(productId),
      },
      data: {
        status: statusString,
        approved: statusString =="Approved",
      },
    })
    console.log("Data updated successfully:", data);
    return res.status(200).json({ message: "Data updated successfully", data });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Error updating data", error });
  }
}

export const logoutadmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> =>{
  const admin_id = req.admin_id;
  try {
    const user_details = await Client.refresh_token_admin.delete({
      where: { adminId: Number(admin_id)},
    });

    console.log(user_details);

    // const user_refresh_token = user_details?.token;

    const token =
      req.cookies.admin_access_token ||
      req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = await Client.blacklist_token.create({
      data: {
        token: token || "",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      },
    });

    console.log("data list", data);

    res.clearCookie("admin_access_token");
    // res.clearCookie("refresh_token_seller");

    res.status(200).json({ message: "The admin is logged out." });
  } catch (error: any) {
    res.status(400).json({ message: "Error in logout: ", error: error });
  }
}
