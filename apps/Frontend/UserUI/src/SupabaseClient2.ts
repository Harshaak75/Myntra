// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { excel_supabase_key, excel_supabase_url } from '../config';

export const getSupabaseClient2 = (token: string) => {
  return createClient(excel_supabase_url, excel_supabase_key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
};