import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateTokensAdmin } from "../utils/tokenUtils";
import {
  createAdminService,
  CreatesuperAdmin,
} from "../Services/admin.services";
import { salt_rounds } from "../config";

const Client = new PrismaClient();

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
        const { accessToken }: any = await generateTokensAdmin(adminInfo.id);
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });
        return res.json({
          message: "Logged In Successfully",
          token: accessToken,
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
    return res
      .status(200)
      .json({
        message: "Admin Created Successfully",
        token: create_admin.admin_token,
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

    return res
      .status(200)
      .json({
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
