import { createClient } from "@supabase/supabase-js";
import { supabase_bucket_name_image, supabase_key_image, supabase_url_image } from "../config";

const supabaseImage = supabase_url_image;
const supabasekey = supabase_key_image;
const bucketName = supabase_bucket_name_image; 

if(!supabaseImage || !supabasekey){
    throw new Error("Missing SUPABASE_URL or supabase_key is required");
}

const supabase1 = createClient(supabaseImage, supabasekey)

export default supabase1;