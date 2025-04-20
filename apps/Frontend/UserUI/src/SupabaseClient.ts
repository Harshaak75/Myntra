// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { supabase_url, supabse_key } from '../config';

export const getSupabaseClient = (token: string) => {
  return createClient(supabase_url, supabse_key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};