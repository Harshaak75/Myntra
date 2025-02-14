import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 5000;

export const serect = process.env.SERECT_PASSWORD;

export const secure_cookie = process.env.SECURE_COOKIE;
