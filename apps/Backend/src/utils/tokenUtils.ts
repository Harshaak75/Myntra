import jwt from "jsonwebtoken";
import { serect } from "../config";
import { PrismaClient } from "@prisma/client";
import { JwtPayload, Secret } from "jsonwebtoken";

const Client = new PrismaClient();


// Function to generate token

export const generateTokens = async (user_id: any) => {
  const accessToken = jwt.sign({ id: user_id }, serect || "", {
    expiresIn: "5m",
  });

  try {
    const verify_refresh_token = await Client.refresh_token.findFirst({
      where: { userId: user_id },
    });
    if (verify_refresh_token) {
      const decode = jwt.decode(verify_refresh_token.token);

      if (decode && typeof decode != "string" && (decode as JwtPayload).exp) {
        const exp = decode.exp;

        if (exp) {
          const current_time = Math.floor(Date.now() / 1000);
          const timeRemaining = exp - current_time;

          if (timeRemaining > 172800) {
            return { accessToken };
          }
        }
      }
    }

    const refreshToken = jwt.sign({ id: user_id }, serect || "", {
      expiresIn: "7d",
    });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Client.refresh_token.upsert({
      where: { userId: user_id },
      update: { token: refreshToken },
      create: { userId: user_id, token: refreshToken, expiresAt },
    });

    return { accessToken };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate tokens");
  }
};
