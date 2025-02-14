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
import { secure_cookie, serect } from "../config";
import { generateTokens } from "../utils/tokenUtils";

const Client = new PrismaClient();

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

    const otp = Math.floor(10000 + Math.random() * 90000);

    otpstore[email] = { otp, expireAt: Date.now() + 5 * 60 * 1000 };

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
      res.json({ success: true, message: "OTP sent successfully!" });
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

  const { email, otp } = req.body;

  try {
    // checking the otp provided by user is correct or not

    if (!otpstore[email]) {
      return res
        .status(400)
        .json({ success: false, message: "Enter Correct OTP" });
    }

    const { otp: sharedOTP, expireAt } = otpstore[email];

    // checking the otp is valid or not

    if (Date.now() > expireAt) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired or not sent!" });
    }

    if (parseInt(otp) !== sharedOTP) {
      return res.status(400).json({ success: false, message: "Invalid OTP!" });
    }

    // delete the otp from memeory, if the otp is verified

    delete otpstore[email];

    // get the id from the user

    const user = await Client.users.findFirst({
      where: {
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
      message: "OTP verified successfully0 and stored in cookie!",
      token: accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to verify OTP", error });
  }
};

// checking for middleware logic

export const protect_my_route = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.user_id;
  res.json({ message: "Protect", id: id });
};
