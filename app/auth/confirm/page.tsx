"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Status = "loading" | "confirmed" | "error";

const DESTINATION: Record<string, string> = {
  sponsor: "/sponsor",
  admin: "/admin/verifications",
  athlete: "/athlete",
};

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [destination, setDestination] = useState("/athlete");

  useEffect(() => {
    async function run() {
      const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      if (!access_token || !refresh_token) {
        setError("This confirmation link is invalid or has expired.");
        setStatus("error");
        return;
      }

      const supabase = createClient();
      const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token });
      if (sessionError) {
        setError(sessionError.message);
        setStatus("error");
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      const role = (userData.user?.user_metadata?.role as string) ?? "athlete";
      const { data: profileRow } = await supabase.from("users").select("role").eq("id", userData.user!.id).maybeSingle();
      const finalRole = profileRow?.role ?? role;

      setDestination(DESTINATION[finalRole] ?? "/athlete");
      setStatus("confirmed");
    }
    run();
  }, []);

  useEffect(() => {
    if (status !== "confirmed") return;
    const t = setTimeout(() => router.replace(destination), 2500);
    return () => clearTimeout(t);
  }, [status, destination, router]);

  return (
    <div className="grid min-h-dvh place-items-center bg-bg px-6 text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
          <p className="text-sm text-muted">Confirming your email…</p>
        </div>
      )}

      {status === "confirmed" && (
        <div className="flex flex-col items-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">Email confirmed</h1>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Your account is active. Taking you to your dashboard…
          </p>
          <Button className="mt-6" onClick={() => router.replace(destination)}>
            Continue now
          </Button>
        </div>
      )}

      {status === "error" && (
        <div>
          <p className="text-sm font-medium text-energy">{error}</p>
          <a href="/login" className="mt-3 inline-block text-sm text-brand underline">
            Go to login
          </a>
        </div>
      )}
    </div>
  );
}
