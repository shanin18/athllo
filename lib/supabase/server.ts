import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { cache } from "react";
import type { User } from "@supabase/supabase-js";

/**
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * Bound to the request cookies so RLS runs as the signed-in user.
 */
export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore; middleware refreshes the session.
          }
        },
      },
    }
  );
}

/**
 * Deduped per-request: getUser() and role lookups are called from the
 * dashboard layout, the page, and the nav in the same render — cache()
 * collapses those into a single round trip and a single point of failure.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export type UserRole = "athlete" | "sponsor" | "admin";

export const getCurrentProfile = cache(async (): Promise<{ user: User; role: UserRole } | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();
  return { user, role: (data?.role as UserRole) ?? "athlete" };
});
