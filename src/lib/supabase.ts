import { createClient } from "@supabase/supabase-js";

// Fallback values prevent crashes during build when env vars are absent.
// Pages using Supabase are marked force-dynamic and never called at build time.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
