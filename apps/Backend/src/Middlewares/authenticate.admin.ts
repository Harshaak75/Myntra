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

    console.log("auth in seller", token);

    if (!token) {
      return res.status(500).json({ message: "Unauthorized" });
    }
    let admin_id: any = null; // ✅ Moved this here

  try {
    let token_exist = null;
    
    try {
      token_exist = await Client.blacklist_token.findFirst({
        where: { token: token },
      });
      console.log("blacklist token", token_exist);
    } catch (err) {
      console.error("Error checking blacklist_token:", err);
      return res
        .status(500)
        .json({ message: "Internal error while checking token" });
    }

    if (token_exist) {
      res.clearCookie("sell_access_token");
      res.clearCookie("refresh_token_seller");
      return res.status(401).json({ message: "Blacklisted token" });
    }

    if (!admin_serect) {
      return res.status(500).json({ message: "Admin secret not found" });
    }

    const decoded: any = jwt.verify(token, admin_serect || "");
    
        if (!decoded || typeof decoded === "string" || !decoded.id) {
          return res.status(403).json({ message: "Invalid token structure" });
        }
    
        admin_id = decoded.id;
        console.log("admin_idlddvmkmdfkmdsl", admin_id);
        console.log("admin", admin_id);
    
        req.admin_id = decoded.id;
        next();
      } catch (err: any) {
        console.error("Token verification failed:", err);
    
        const decoded_token: any = jwt.decode(token);
        admin_id = decoded_token?.id;
    
        console.log(admin_id);
    
        if (err.name === "TokenExpiredError") {
          try {
            const accessToken = await generateTokensAdmin(admin_id);
    
            res.cookie("admin_access_token", accessToken, {
              httpOnly: true,
              secure: secure_cookie == "Production",
              path: "/",
              maxAge: 15 * 60 * 1000,
              sameSite: secure_cookie == "Production" ? "none" : "lax",
            });
    
            res.setHeader("x-new-access-token", accessToken);
    
            res.locals.newAccessToken = accessToken;
    
            if (admin_id !== null) {
              req.admin_id = admin_id.toString();
            }
    
            next();
          } catch (error) {
            await Client.blacklist_token.create({
              data: {
                token,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
              },
            });
    
            res.clearCookie("admin_access_token");
            // res.clearCookie("refresh_token_seller");
    
            return res
              .status(401)
              .json({ message: "Session expired. Please log in again." });
          }
        } else if (err?.name === "JsonWebTokenError") {
          return res.status(403).json({ message: "Invalid token" });
        } else {
          return res
            .status(500)
            .json({ message: "Error in authenticating admin", error: err });
        }
      }
    };
    