import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokensAdmin } from "../utils/tokenUtils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { admin_serect } from "../config";

const Client = new PrismaClient();

const ACCESS_TOKEN_EXPIRATION = "5m"; // 5 minutes
const REFRESH_TOKEN_EXPIRATION = "1d"; // 1 day

export const login_productAdmin = async (email: string, password: string) => {
  try {
    const productAdmin = await Client.admin_users.findFirst({
      where: { email },
    });

    console.log("productAdmin", productAdmin);

    if (!productAdmin) {
      throw new Error("Invalid email or password");
    }

    console.log("1");
    console.log("data", email, password, productAdmin.password);

    const isPasswordCorrect = await bcrypt.compare(password, productAdmin.password);

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    console.log("2");

    const accessToken = jwt.sign(
      {
        id: productAdmin.id,
        currRole:"product_admin",
        role: "authenticated",
        aud: "authenticated",
      },
      admin_serect || "",
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }
    );

    console.log("3");

    const refreshToken = jwt.sign(
      { id: productAdmin.id, currRole:"product_admin" },
      admin_serect || "",
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      }
    );

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    console.log("4");

    await Client.refresh_token_admin.upsert({
      where: { adminId: productAdmin.id },
      update: { token: refreshToken, expiresAt },
      create: {
        adminId: productAdmin.id,
        token: refreshToken,
        expiresAt,
      },
    });

    console.log("5");

    return { accessToken };

  } catch (error: any) {
    console.error("Login Product Admin Error:", error.message); // Add this to see in backend logs
  throw new Error(`Error logging in product admin: ${error.message}`);
  }
};

export const delete_product = async (id: any) => {
  try {
    const deletedProduct = await Client.product.delete({
      where: { id: parseInt(id) },
    });
    console.log(deletedProduct);

    return deletedProduct;
  } catch (error: any) {
    throw new Error(`Error deleting product: ${error.message}`);
  }
};

export const getSellerdata = async () => {
  try {
    const sellerdata = await Client.seller.findMany();
    return sellerdata;
  } catch (error: any) {
    throw new Error(`Error getting seller data: ${error.message}`);
  }
};

export const approve_product = async (product_id: string, approve: boolean) => {
  try {
    const updateApproveal = await Client.product.update({
      where: { id: parseInt(product_id) },
      data: { approved: approve },
    });

    return updateApproveal;
  } catch (error: any) {
    throw new Error(`Error approving product: ${error.message}`);
  }
};
