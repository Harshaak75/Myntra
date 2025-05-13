import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

import nodemailer from "nodemailer";
import type { TransportOptions } from "nodemailer";
import axios from "axios";

import { JwtPayload, Secret } from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

import jwt from "jsonwebtoken";
import { redis_url, secure_cookie, serect, user_serect } from "../config";
import { generateTokens } from "../utils/tokenUtils";

import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "");

const Client = new PrismaClient();

const OTP_LIMIT = 5; // Max 5 OTPs per hour
const OTP_WINDOW_SECONDS = 5 * 60; // 1 minutes window

// storing otp temporarily in memory

const ACCESS_TOKEN_EXPIRATION = "5m"; // 5 minutes
const REFRESH_TOKEN_EXPIRATION = "1d"; // 1 day

const otpstore: Record<string, { otp: number; expireAt: number }> = {};

export const auth_the_user = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  console.log(__dirname);
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  // TODO: Implement the logic to authenticate the user with the provided email and send OTP

  try {
    console.log(__dirname);
    const { email } = req.body;

    const pattern = /^[^@]+@gmail\.com$/;

    if (!pattern.test(email)) {
      return res
        .status(400)
        .json({ error: "Only gmail accounts are allowed." });
    }

    const redisKey = `otp:${email}`;
    const requestCount = await redis.get(redisKey);

    const ttll = await redis.ttl(redisKey);
    console.log("Redis Key TTL (seconds):", ttll);

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

    const ttl = await redis.ttl(redisKey);
    console.log("Redis Key TTL (seconds):", ttl);

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute = 60,000 ms

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
      text: `Your OTP is ${otp}. It is valid for 1 minutes.`,
    };

    try {
      await transpoter.sendMail(mailOptions);

      await Client.otpTable.upsert({
        where: { email },
        update: { otp, expiresAt, lastRequestAt: new Date() },
        create: { email, otp, expiresAt, lastRequestAt: new Date() },
      });

      const sessionToken = jwt.sign({ email }, user_serect || "", {
        expiresIn: "1m",
      });

      await redis.set(`session:${sessionToken}`, email, "EX", 1 * 60); // 1 min expiry

      res.cookie("sessionToken", sessionToken, {
        httpOnly: true,
        path: "/",
        secure: secure_cookie == "Production",
        maxAge: 1 * 60 * 1000, // 1 minutes expiry
        sameSite: secure_cookie == "Production" ? "none" : "lax",
      });

      res.status(200).json({
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
      return res.status(401).json({ error: "Invalid OTP." });
    }

    if (!otpRecord.expiresAt || new Date() > new Date(otpRecord.expiresAt)) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    await Client.otpTable.delete({ where: { email } });

    res.clearCookie("sessionToken");

    await redis.del(`otp:${sessionToken}`);

    const user_data = await Client.users.findUnique({
      where: { email: email },
    });

    let user;

    if (!user_data) {
      user = await Client.users.create({
        data: {
          email: email,
        },
      });
    }

    // const { accessToken }: any = await generateTokens(user?.id);

    const accessToken = jwt.sign(
      {
        id: user_data ? user_data.id : user?.id,
        currRole: "user",
        role: "authenticated",
        aud: "authenticated",
      },
      serect || "",
      {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      }
    );

    const refreshToken = jwt.sign(
      { id: user_data ? user_data.id : user?.id, currRole: "user" },
      serect || "",
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      }
    );

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    console.log("done3");

    await Client.refresh_token.upsert({
      where: { userId: user_data ? user_data.id : user?.id },
      update: { token: refreshToken, expiresAt },
      create: {
        userId: user_data ? Number(user_data.id) : Number(user?.id),
        token: refreshToken,
        expiresAt,
      },
    });

    // console.log("seller_contoller: ",seller_account)

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      path: "/",
      secure: secure_cookie == "Production",
      sameSite: secure_cookie == "Production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    });

    res.status(200).json({
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

export const verify_the_otp2 = async (
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
      return res.status(401).json({ error: "Invalid OTP." });
    }

    if (!otpRecord.expiresAt || new Date() > new Date(otpRecord.expiresAt)) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }

    await Client.otpTable.delete({ where: { email } });

    res.clearCookie("sessionToken");

    await redis.del(`otp:${sessionToken}`);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully and stored in cookie!",
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
  const user_id = Number(req.user_id);

  try {
    const user_details = await Client.refresh_token.findUnique({
      where: { userId: user_id },
    });

    const user_refresh_token = user_details?.token;

    await Client.blacklist_token.create({
      data: {
        token: user_refresh_token || "",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      },
    });

    res.clearCookie("access_token", {
      httpOnly: true,
      path: "/",
      secure: secure_cookie == "Production",
      sameSite: secure_cookie == "Production" ? "none" : "lax",
    });

    res.status(200).json({ message: "The user is logged out." });
  } catch (error: any) {
    res.status(400).json({ message: "Error in logout: ", error: error });
  }
};
