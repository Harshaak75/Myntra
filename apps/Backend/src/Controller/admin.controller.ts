import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokensAdmin } from "../utils/tokenUtils";
import {
  createAdminService,
  CreatesuperAdmin,
} from "../Services/admin.services";
import { admin_serect, salt_rounds, secure_cookie } from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const Client = new PrismaClient();

const ACCESS_TOKEN_EXPIRATION = "5m"; // 5 minutes
const REFRESH_TOKEN_EXPIRATION = "1d"; // 1 day

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const adminData = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const adminInfo = await Client.admin_users.findUnique({
      where: { email: adminData.email },
    });

    if (!adminInfo) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const adminPass = adminInfo.password;

    bcrypt.compare(adminData.password, adminPass, async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Server Error" });
      }
      if (!result) {
        return res
          .status(401)
          .json({ message: "Incorrect Password Try again.." });
      } else {
        const accessToken = jwt.sign(
          {
            id: adminInfo.id,
            role: "authenticated",
            aud: "authenticated",
          },
          admin_serect || "",
          {
            expiresIn: ACCESS_TOKEN_EXPIRATION,
          }
        );

        const refreshToken = jwt.sign(
          { id: adminInfo.id },
          admin_serect || "",
          {
            expiresIn: REFRESH_TOKEN_EXPIRATION,
          }
        );

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

        await Client.refresh_token_admin.upsert({
          where: { adminId: adminInfo.id },
          update: { token: refreshToken, expiresAt },
          create: {
            adminId: adminInfo.id,
            token: refreshToken,
            expiresAt,
          },
        });

        res.cookie("admin_access_token", accessToken, {
          httpOnly: true,
          path: "/",
          secure: secure_cookie === "Production",
          sameSite: secure_cookie == "Production" ? "none" : "lax",
          maxAge: 15 * 60 * 1000,
        });

        return res.json({
          message: "Logged In Successfully",
          ProductAdmintoken: accessToken,
        });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error: error in login admin", error: error });
  }
};

export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const adminData = req.body;

  try {
    const create_admin = await createAdminService(adminData);

    res.cookie("Super_admin_access_token", create_admin.accessToken, {
      httpOnly: true,
      path: "/",
      secure: secure_cookie === "Production",
      sameSite: secure_cookie == "Production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Admin Created Successfully",
      token: create_admin.accessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error in creating admin", error });
  }
};

export const createSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingSuperAdmin = await Client.admin_users.findUnique({
      where: { email: email },
    });

    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, Number(salt_rounds));

    const Create_super_admin = await CreatesuperAdmin({
      name,
      hashedPassword,
      email,
    });

    res.cookie("Super_admin_access_token", Create_super_admin, {
      httpOnly: true,
      path: "/",
      secure: secure_cookie === "Production",
      sameSite: secure_cookie == "Production" ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Super Admin Created Successfully",
      token: Create_super_admin,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in creating super admin", error });
  }
};

export const getAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const admins = await Client.admin_users.findMany();

    if (!admins) {
      return res.status(404).json({ message: "No admins found" });
    }
    return res.status(200).json({ admins });
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching admins", error });
  }
};
