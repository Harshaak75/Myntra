import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 5000;

export const serect = process.env.SERECT_PASSWORD;

export const secure_cookie = process.env.SECURE_COOKIE;

export const access_token_expire: string = process.env.ACCESS_TOKEN_EXPIRE || "5m"; // Default to "5m"
export const refresh_token_expire: string = process.env.REFRESH_TOKEN_EXPIRE || "1d";
export const refresh_token_renew_time =  parseInt(process.env.REFRESH_TOKEN_RENEW_TIME || "79200", 10); 

export const redis_url = process.env.REDIS_URL
