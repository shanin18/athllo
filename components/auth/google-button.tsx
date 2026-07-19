"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <Button type="button" variant="outline" className="w-full" onClick={handleClick} loading={loading}>
      <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4" aria-hidden="true">
        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v2.98h3.86c2.26-2.09 3.56-5.17 3.56-8.8z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.93l-3.86-2.98c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09C3.25 21.3 7.31 24 12 24z" />
        <path fill="#FBBC05" d="M5.27 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.63H1.27A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.27 5.37l4-3.09z" />
        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.63l4 3.09c.95-2.85 3.6-4.97 6.73-4.97z" />
      </svg>
      Continue with Google
    </Button>
  );
}
