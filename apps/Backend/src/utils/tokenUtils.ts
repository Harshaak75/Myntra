import jwt from "jsonwebtoken";
import {
  access_token_expire,
  admin_serect,
  refresh_token_expire,
  refresh_token_renew_time,
  seller_serect,
  serect,
} from "../config";
import { PrismaClient } from "@prisma/client";
import { JwtPayload, Secret } from "jsonwebtoken";

const Client = new PrismaClient();

const ACCESS_TOKEN_EXPIRATION = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRATION = "30d"; // 30 day

// Function to generate tokens
export const generateTokens = async (user_id: any) => {
  console.log(user_id);
  const accessToken = jwt.sign(
    {
      id: user_id,
      currRole: "user",
      role: "authenticated",
      aud: "authenticated",
    },
    serect || "",
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }
  );
  try {
    const existingRefreshToken = await Client.refresh_token.findFirst({
      where: { userId: user_id },
    });
    console.log("1");

    if (existingRefreshToken) {
      try {
        const decoded = jwt.verify(
          existingRefreshToken.token,
          serect || ""
        ) as JwtPayload;
        console.log("2");

        if (decoded && decoded.exp) {
          const current_time = Math.floor(Date.now() / 1000);
          const timeRemaining = decoded.exp - current_time;

          console.log("3");

          // If token is still valid and issued within last 22 hours, reuse it
          if (timeRemaining > refresh_token_renew_time) {
            return accessToken;
          } else {
            const refreshToken = jwt.sign(
              {
                id: user_id,
                currRole: "user",
                role: "authenticated",
                aud: "authenticated",
              },
              serect || "",
              {
                expiresIn: REFRESH_TOKEN_EXPIRATION,
              }
            );

            console.log("4");

            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

            await Client.refresh_token.upsert({
              where: { userId: user_id },
              update: { token: refreshToken, expiresAt },
              create: { userId: user_id, token: refreshToken, expiresAt },
            });

            console.log("5");

            return accessToken;
          }
        }
      } catch (err) {
        console.warn("Invalid refresh token, generating a new one.");
      }
    }
    console.log("6");

    throw new Error("Session expired. Please log in again.");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate tokens");
  }
};

export const generateTokensAdmin = async (user_id: any) => {
  const accessToken = jwt.sign(
    {
      id: user_id,
      currRole: "product_admin",
      role: "authenticated",
      aud: "authenticated",
    },
    admin_serect || "",
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }
  );

  try {
    const existingRefreshToken = await Client.refresh_token_admin.findFirst({
      where: { adminId: user_id },
    });

    if (existingRefreshToken) {
      try {
        const decoded = jwt.verify(
          existingRefreshToken.token,
          admin_serect || ""
        ) as JwtPayload;

        if (decoded && decoded.exp) {
          const current_time = Math.floor(Date.now() / 1000);
          const timeRemaining = decoded.exp - current_time;

          // If token is still valid and issued within last 22 hours, reuse it
          if (timeRemaining > refresh_token_renew_time) {
            return accessToken;
          } else {
            const refreshToken = jwt.sign(
              {
                id: user_id,
                currRole: "product_admin",
                role: "authenticated",
                aud: "authenticated",
              },
              admin_serect || "",
              {
                expiresIn: REFRESH_TOKEN_EXPIRATION,
              }
            );

            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

            await Client.refresh_token_admin.upsert({
              where: { adminId: user_id },
              update: { token: refreshToken, expiresAt },
              create: { adminId: user_id, token: refreshToken, expiresAt },
            });

            return accessToken;
          }
        }
      } catch (err) {
        console.warn("Invalid refresh token, generating a new one.");
      }
    }

    throw new Error("Session expired. Please log in again.");

    // Generate a new refresh token
    // const refreshToken = jwt.sign({ id: user_id }, admin_serect || "", {
    //   expiresIn: REFRESH_TOKEN_EXPIRATION,
    // });

    // const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // await Client.refresh_token_admin.upsert({
    //   where: { adminId: user_id },
    //   update: { token: refreshToken, expiresAt },
    //   create: { adminId: user_id, token: refreshToken, expiresAt },
    // });

    // return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate tokens");
  }
};

//seller token generation

export const generateTokensSeller = async (user_id: any) => {
  const seller = await Client.seller.findUnique({ where: { id: user_id } });

  const accessToken = jwt.sign(
    {
      id: user_id,
      currRole: "seller",
      role: "authenticated",
      aud: "authenticated",
      isVerified: seller?.isVerified ?? false,
    },
    seller_serect || "",
    {
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    }
  );

  try {
    const existingRefreshToken = await Client.refresh_token_seller.findFirst({
      where: { sellerId: user_id },
    });

    if (existingRefreshToken) {
      try {
        const decoded = jwt.verify(
          existingRefreshToken.token,
          seller_serect || ""
        ) as JwtPayload;

        if (decoded && decoded.exp) {
          const current_time = Math.floor(Date.now() / 1000);
          const timeRemaining = decoded.exp - current_time;

          // If token is still valid and issued within last 22 hours, reuse it
          if (timeRemaining > refresh_token_renew_time) {
            return accessToken;
          } else {
            const refreshToken = jwt.sign(
              { id: user_id, currRole: "seller" },
              seller_serect || "",
              {
                expiresIn: REFRESH_TOKEN_EXPIRATION,
              }
            );

            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 day

            await Client.refresh_token_seller.upsert({
              where: { sellerId: user_id },
              update: { token: refreshToken, expiresAt },
              create: { sellerId: user_id, token: refreshToken, expiresAt },
            });

            return accessToken;
          }
        }
      } catch (err) {
        console.warn("Invalid refresh token, generating a new one.");
      }
    }

    throw new Error("Session expired. Please log in again.");

    // Generate a new refresh token
    // const refreshToken = jwt.sign({ id: user_id }, seller_serect || "", {
    //   expiresIn: REFRESH_TOKEN_EXPIRATION,
    // });

    // const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    // await Client.refresh_token_seller.upsert({
    //   where: { sellerId: user_id },
    //   update: { token: refreshToken, expiresAt },
    //   create: { sellerId: user_id, token: refreshToken, expiresAt },
    // });

    // // console.log("Access token",accessToken)

    // return accessToken;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate tokens");
  }
};
