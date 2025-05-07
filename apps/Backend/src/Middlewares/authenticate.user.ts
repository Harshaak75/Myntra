import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { admin_serect, secure_cookie, serect } from "../config";
import { generateTokens } from "../utils/tokenUtils";

import { PrismaClient } from "@prisma/client";
import { isPrismaConnectionError } from "../utils/CheckError";

const Client = new PrismaClient();

// verifying the token, if token is expired then it will create a new token and store it in cookie

export const authenticate_User = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token =
    req.cookies.access_token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let user_id: any = null;

  try {
    let token_exist = null;

    try {
      token_exist = await Client.blacklist_token.findFirst({
        where: { token },
      });
    } catch (error: any) {
      console.error("Error checking blacklist_token:", error);

      if (isPrismaConnectionError(error)) {
        return res
          .status(503)
          .json({ message: "Database temporarily unreachable", retry: true });
      }

      return res
        .status(500)
        .json({ message: "Internal error while checking token" });
    }

    if (token_exist) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return res
        .status(401)
        .json({ message: "Unauthorized token accessing resource" });
    }

    const decoded: any = jwt.verify(token, serect || "");

    if (!decoded || typeof decoded === "string" || !decoded.id) {
      return res.status(403).json({ message: "Invalid token structure" });
    }

    user_id = decoded.id;
    req.user_id = user_id;
    return next();
  } catch (error: any) {
    console.error("Token verification failed:", error);

    if (isPrismaConnectionError(error)) {
      return res
        .status(503)
        .json({ message: "Database temporarily unreachable", retry: true });
    }

    const decoded_token: any = jwt.decode(token);
    user_id = decoded_token?.id;

    if (error.name === "TokenExpiredError") {
      try {
        const accessToken = await generateTokens(user_id);

        res.cookie("access_token", accessToken, {
          httpOnly: true,
          path: "/",
          secure: secure_cookie === "Production",
          sameSite: secure_cookie === "Production" ? "none" : "lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        if (user_id !== null) {
          req.user_id = user_id.toString();
        }

        return next();
      } catch (refreshError: any) {
        console.error("Error refreshing token:", refreshError);

        if (isPrismaConnectionError(refreshError)) {
          return res
            .status(503)
            .json({ message: "Database temporarily unreachable", retry: true });
        }

        await Client.blacklist_token.create({
          data: {
            token,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          },
        });

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return res
          .status(401)
          .json({ message: "Session expired. Please log in again." });
      }
    } else if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({
        message: "Error in authenticating seller",
        error: error?.message || error,
      });
    }
  }
};
