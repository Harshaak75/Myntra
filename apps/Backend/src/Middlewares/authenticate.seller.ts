import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { admin_serect, secure_cookie, seller_serect, serect } from "../config";
import {
  generateTokens,
  generateTokensAdmin,
  generateTokensSeller,
} from "../utils/tokenUtils";

import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();

export const authenticate_Seller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.cookies.sell_access_token || req.headers["authorization"]?.split(" ")[1];

  console.log("auth in seller",token)

  try {
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token_exist = await Client.blacklist_token.findFirst({
      where: {
        token: token,
      },
    });

    console.log("blacklist token", token_exist)

    if (token_exist) {
      res.clearCookie("sell_access_token");
      res.clearCookie("refresh_token_seller");

      return res
        .status(401)
        .json({ message: "Unauthorized token accessing resourceeeeeeeeeeeee" });
    }

    jwt.verify(token, seller_serect || "", async (err: any, decode: any) => {
      const decode_token = jwt.decode(token);

      if (!decode_token || typeof decode_token === "string") {
        return res.status(403).json({ message: "Invalid token" });
      }

      const seller_id = decode_token?.id;

      if (err?.name === "TokenExpiredError") {
        // console.log("generetavhe token");

        try {
          const accessToken = await generateTokensSeller(seller_id);
          // console.log("access token", accessToken);

          res.cookie("sell_access_token", accessToken, {
            httpOnly: true,
            secure: secure_cookie == "Production",
            path: "/",
            maxAge: 15 * 60 * 1000,
            sameSite: secure_cookie == "Production" ? "none" : "lax"
          });
          req.seller_id = seller_id;
          next();
        } catch (error) {
          await Client.blacklist_token.create({
            data: {
              token,
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            },
          });

          res.clearCookie("sell_access_token");
          res.clearCookie("refresh_token_seller");

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
          req.seller_id = decode_token.id;
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
