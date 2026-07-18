"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function ProfilePhotoUpload({
  table,
  column,
  userId,
  initialUrl,
  shape = "circle",
  className,
}: {
  table: "athlete_profiles" | "sponsor_profiles";
  column: "avatar_url" | "cover_url" | "logo_url";
  userId: string;
  initialUrl: string | null;
  shape?: "circle" | "banner";
  className?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/${column}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-media")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      setUploading(false);
      setError("Upload failed. Please try again.");
      return;
    }

    const { data: publicUrl } = supabase.storage.from("profile-media").getPublicUrl(path);

    const { error: dbError } = await supabase
      .from(table)
      .update({ [column]: publicUrl.publicUrl })
      .eq("user_id", userId);

    setUploading(false);
    if (dbError) {
      setError("Could not save photo.");
      return;
    }
    setUrl(publicUrl.publicUrl);
  }

  return (
    <div className={className}>
      <div
        className={cn(
          "group relative cursor-pointer overflow-hidden bg-surface",
          shape === "circle" ? "h-20 w-20 rounded-full" : "h-32 w-full rounded-xl"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {url ? (
          <Image src={url} alt="" fill className="object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted">
            <Camera className="h-5 w-5" />
          </div>
        )}
        <div className="absolute inset-0 grid place-items-center bg-panel/50 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="mt-1.5 text-xs text-energy">{error}</p>}
    </div>
  );
}
