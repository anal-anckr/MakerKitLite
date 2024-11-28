import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { Database } from '~/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
export const client: SupabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseKey,
);
