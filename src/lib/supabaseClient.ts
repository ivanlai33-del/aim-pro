import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a browser client that's compatible with SSR middleware
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
