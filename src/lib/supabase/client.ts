import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let browserClient: ReturnType<typeof createClient<Database>> | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase 環境變數尚未設定");
  browserClient = createClient<Database>(url, key);
  return browserClient;
}
