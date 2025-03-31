import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { admin_serect, secure_cookie, serect } from "../config";
import { generateTokens, generateTokensAdmin } from "../utils/tokenUtils";

import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();

export const authenticate_Admin_User = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token =
    req.cookies.access_token || req.headers["authorization"]?.split(" ")[1];

  try {
    if (!token) {
      return res.status(500).json({ message: "Unauthorized" });
    }

    const token_exist = await Client.blacklist_token.findMany({
      where: {
        token,
      },
    });

    if (token_exist) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");

      return res
        .status(401)
        .json({ message: "Unauthorized token accessing resource" });
    }

    if (!admin_serect) {
      return res.status(500).json({ message: "Admin secret not found" });
    }

    return jwt.verify(token, admin_serect, async (err: any, decode: any) => {
      const decode_token = jwt.decode(token);

      if (!decode_token || typeof decode_token === "string") {
        return res.status(403).json({ message: "Invalid token" });
      }

      const admin_id = decode_token?.id;

      if (err?.name === "TokenExpiredError") {
        try {
          const { accessToken, refreshToken }: any =
            await generateTokensAdmin(admin_id);

          res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: secure_cookie == "Production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
          });
          req.admin_id = admin_id;
          next();
        } catch (error) {
          await Client.blacklist_token.create({
            data: {
              token,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            },
          });

          res.clearCookie("access_token");
          res.clearCookie("refresh_token_admin");

          return res
            .status(401)
            .json({ message: "Session expired. Please log in again." });
        }
      }

      if (err?.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      }

      if (!err) {
        if (decode_token && typeof decode_token !== "string") {
          req.admin_id = decode_token.id;
          next();
        } else {
          return res.status(403).json({ message: "Invalid token" });
        }
      }
    });
  } catch (error) {
    res.status(401).json({ message: "error in the middleware", error: error });
  }
};
