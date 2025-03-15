import { createClient } from "@supabase/supabase-js";
import { supabase_key, supabse_url } from "../config";

const supabaseUrl = supabse_url
const supabaseKey = supabase_key

if(!supabaseUrl || !supabaseKey){
    throw new Error("Missing SUPABASE_URL or supabase_key is required");
}

const supabase = createClient(supabaseUrl,supabaseKey);

export default supabase;