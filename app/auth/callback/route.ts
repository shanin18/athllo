import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const DESTINATION: Record<string, string> = {
  sponsor: "/sponsor",
  admin: "/admin/verifications",
  athlete: "/athlete",
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const pendingCookies: { name: string; value: string; options?: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          pendingCookies.push(...cookiesToSet);
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login?error=oauth", request.url));
  }

  const { data: profileRow } = await supabase.from("users").select("role").eq("id", data.user.id).maybeSingle();
  const role = profileRow?.role ?? "athlete";
  const destination = DESTINATION[role] ?? "/athlete";

  const response = NextResponse.redirect(new URL(destination, request.url));
  pendingCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
  return response;
}
