import dotenv from "dotenv";

dotenv.config();

export const port = process.env.PORT || 5000;

export const serect = process.env.SERECT_PASSWORD;

export const secure_cookie = process.env.SECURE_COOKIE;

export const admin_serect = process.env.SERECT_ADMIN_PASSWORD;

export const seller_serect = process.env.SERECT_SELLER_PASSWORD;

export const access_token_expire: string = process.env.ACCESS_TOKEN_EXPIRE || "5m"; // Default to "5m"
export const refresh_token_expire: string = process.env.REFRESH_TOKEN_EXPIRE || "1d";
export const refresh_token_renew_time =  parseInt(process.env.REFRESH_TOKEN_RENEW_TIME || "79200", 10); 

export const redis_url = process.env.REDIS_URL

export const salt_rounds = process.env.SALT_ROUND

// supabase for s3 bucket

export const supabse_url = process.env.SUPABASE_URL
export const supabase_key = process.env.SUPABASE_SERVICES_ROLE_KEY
export const bucket_name = process.env.BUCKET_NAME

export const user_serect = process.env.SERECT_USER_PASSWORD


// supabase s3 image

export const supabase_url_image = process.env.SUPABASE_URL_IMAGE;
export const supabase_key_image = process.env.SUPABASE_SERVICES_ROLE_KEY_IMAGE;
export const supabase_bucket_name_image = process.env.BUCKET_NAME_IMAGE
