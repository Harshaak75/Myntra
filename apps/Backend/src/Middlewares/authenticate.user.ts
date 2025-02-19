import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { secure_cookie, serect } from "../config";
import { generateTokens } from "../utils/tokenUtils";

import { PrismaClient } from "@prisma/client";

const Client = new PrismaClient();

// verifying the token, if token is expired then it will create a new token and store it in cookie

export const authenticate_User = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const token = req.cookies.access_token || req.headers["authorization"]?.split(' ')[1];

  try {
    if (!token) {
      return res.status(500).json({ message: "Unauthorized" });
    }

    jwt.verify(token, serect || "", async (err: any, decode: any) => {
      const decode_token = jwt.decode(token);

      if (!decode_token || typeof decode_token === "string") {
        return res.status(403).json({ message: "Invalid token" });
      }

      const user_id = decode_token?.id;

      if (err?.name === "TokenExpiredError") {
        // if (!decode_token || typeof decode_token === "string") {
        //   return res.status(403).json({ message: "Invalid token" });
        // }

        // const user_id = decode_token?.id;

        const { accessToken }: any = await generateTokens(user_id);

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: secure_cookie == "Production",
          sameSite: "strict",
          maxAge: 15 * 60 * 1000,
        });
        req.user_id = user_id;
        next();
      }

      if (err?.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      }

      if (!err) {
        if (decode_token && typeof decode_token !== "string") {
          req.user_id = decode_token.id;
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
