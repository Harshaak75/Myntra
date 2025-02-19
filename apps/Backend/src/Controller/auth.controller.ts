import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";

dotenv.config();

import nodemailer from "nodemailer";
import type { TransportOptions } from "nodemailer";
import axios from "axios";

import { JwtPayload, Secret } from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { redis_url, secure_cookie, serect } from "../config";
import { generateTokens } from "../utils/tokenUtils";

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "");

const Client = new PrismaClient();

const OTP_LIMIT = 5; // Max 5 OTPs per hour
const OTP_WINDOW_SECONDS = 60 * 60; // 1 hour window

// storing otp temporarily in memory

const otpstore: Record<string, { otp: number; expireAt: number }> = {};

export const auth_the_user = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  // TODO: Implement the logic to authenticate the user with the provided email and send OTP

  try {
    const { email } = req.body;

    const user = await Client.users.findUnique({ where: { email: email } });

    if (user) {
      res
        .status(400)
        .json({ success: false, message: "User already exists. Login" });
      return;
    }

    const redisKey = `otp:${email}`;
    const requestCount = await redis.get(redisKey);

    if (requestCount && parseInt(requestCount) >= OTP_LIMIT) {
      return res
        .status(429)
        .json({ error: "OTP request limit reached. Try again later." });
    }

    await redis
      .multi()
      .incr(redisKey)
      .expire(redisKey, OTP_WINDOW_SECONDS)
      .exec();

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // otpstore[email] = { otp, expireAt: Date.now() + 5 * 60 * 1000 };

    const transpoter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    } as TransportOptions);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };

    try {
      await transpoter.sendMail(mailOptions);

      await Client.otpTable.upsert({
        where: { email },
        update: { otp, expiresAt, lastRequestAt: new Date() },
        create: { email, otp, expiresAt, lastRequestAt: new Date() },
      });

      const sessionToken = jwt.sign({ email }, "otp_secret", {
        expiresIn: "10m",
      });

      await redis.set(`session:${sessionToken}`, email, "EX", 10 * 60); // 10 min expiry

      res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        // secure: true, // Set to true if using HTTPS
        secure: secure_cookie == "Production",
        maxAge: 10 * 60 * 1000, // 10 minutes expiry
        sameSite: "strict",
      });

      res.json({
        success: true,
        message: "OTP sent successfully!",
        token: sessionToken,
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Failed to send OTP", error });
    }

    // res.json({ success: true, message: "OTP sent successfully!", response });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP", error });
  }
};

// verify the otp logic

export const verify_the_otp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const { otp } = req.body;

  const sessionToken =
    req.cookies.sessionToken || req.headers["authorization"]?.split(" ")[1];

  console.log(sessionToken);

  try {
    // checking the otp provided by user is correct or not

    if (!sessionToken) {
      return res.status(400).json({ error: "Session token is required." });
    }

    const email = await redis.get(`session:${sessionToken}`);

    if (!email) {
      return res
        .status(400)
        .json({ error: "Invalid or expired session token." });
    }

    const otpRecord = await Client.otpTable.findUnique({ where: { email } });

    if (!otpRecord || otpRecord.otp !== (otp as string)) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    if (!otpRecord.expiresAt || new Date() > new Date(otpRecord.expiresAt)) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    await Client.otpTable.delete({ where: { email } });

    res.clearCookie("sessionToken");

    await redis.del(`otp:${sessionToken}`);

    const user = await Client.users.create({
      data: {
        email: email,
      },
    });

    const { accessToken }: any = await generateTokens(user?.id);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: secure_cookie == "Production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "OTP verified successfully and stored in cookie!",
      token: accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to verify OTP", error });
  }
};

// checking for middleware logic

export const getProfile = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user_id;
  res.json({ message: "Protect", id: id });
};

export const logout_user = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = Number(req.user_id)

  try {
    const user_details = await Client.refresh_token.findUnique({
      where: { userId: user_id }
    })

    const user_refresh_token = user_details?.token

    await Client.blacklist_token.create({
      data:{
        token: user_refresh_token || "",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      }
    })

    res.clearCookie("access_token");

    res.status(200).json({message: "The user is logged out."})

  } catch (error: any) {
    res.status(400).json({message: "Error in logout: " , error: error})
  }
};
