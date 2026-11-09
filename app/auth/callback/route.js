import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  if (code) {
    const { error } = await supabaseServer().auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/dashboard", url.origin));
  }
  return NextResponse.redirect(new URL("/masuk?error=1", url.origin));
}
