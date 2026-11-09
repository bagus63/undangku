"use client";
import { createBrowserClient } from "@supabase/ssr";
import { mockClient } from "./mock";

let client;
export function supabaseBrowser() {
  if (!client && process.env.NEXT_PUBLIC_SUPABASE_URL === "mock") client = mockClient();
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "belum-diatur"
    );
  }
  return client;
}
