import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PRIVATE = ["/dashboard", "/editor", "/tamu", "/rsvp", "/lihat", "/admin"];

export async function middleware(request) {
  let response = NextResponse.next({ request });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "mock") return response;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(list) {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  if (!user && PRIVATE.some((p) => path === p || path.startsWith(p + "/"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/masuk";
    url.searchParams.set("lanjut", path);
    return NextResponse.redirect(url);
  }
  if (user && path === "/masuk") {
    const url = request.nextUrl.clone();
    const lanjut = request.nextUrl.searchParams.get("lanjut");
    return NextResponse.redirect(new URL(lanjut && lanjut.startsWith("/") ? lanjut : "/dashboard", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/editor/:path*", "/tamu/:path*", "/rsvp/:path*", "/lihat/:path*", "/admin/:path*", "/masuk"],
};
