"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;

function parsePos(pos: string | null): { x: number; y: number } {
  if (!pos) return { x: 50, y: 50 };
  const [x, y] = pos.replace(/%/g, "").split(" ").map(Number);
  return { x: isNaN(x) ? 50 : x, y: isNaN(y) ? 50 : y };
}

export function ProfilePhotoUpload({
  table,
  column,
  posColumn,
  userId,
  initialUrl,
  initialPos,
  shape = "circle",
  className,
}: {
  table: "athlete_profiles" | "sponsor_profiles";
  column: "avatar_url" | "cover_url" | "logo_url";
  posColumn: "avatar_pos" | "cover_pos" | "logo_pos";
  userId: string;
  initialUrl: string | null;
  initialPos?: string | null;
  shape?: "circle" | "banner";
  className?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [pos, setPos] = useState(parsePos(initialPos ?? null));
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    setProgress(15);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/${column}-${Date.now()}.${ext}`;

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 10 : p));
    }, 150);

    const { error: uploadError } = await supabase.storage
      .from("profile-media")
      .upload(path, file, { cacheControl: "3600", upsert: true });

    clearInterval(progressTimer);

    if (uploadError) {
      setUploading(false);
      setProgress(0);
      setError("Upload failed. Please try again.");
      return;
    }

    setProgress(100);
    const { data: publicUrl } = supabase.storage.from("profile-media").getPublicUrl(path);

    const { error: dbError } = await supabase
      .from(table)
      .update({ [column]: publicUrl.publicUrl, [posColumn]: "50% 50%" })
      .eq("user_id", userId);

    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 300);

    if (dbError) {
      setError("Could not save photo.");
      return;
    }
    setUrl(publicUrl.publicUrl);
    setPos({ x: 50, y: 50 });
  }

  function updatePosFromEvent(clientX: number, clientY: number) {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setPos({ x, y });
  }

  async function persistPos(x: number, y: number) {
    const supabase = createClient();
    await supabase
      .from(table)
      .update({ [posColumn]: `${x.toFixed(0)}% ${y.toFixed(0)}%` })
      .eq("user_id", userId);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!url) return;
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosFromEvent(e.clientX, e.clientY);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    updatePosFromEvent(e.clientX, e.clientY);
  }
  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    persistPos(pos.x, pos.y);
  }

  return (
    <div className={className}>
      <div
        ref={boxRef}
        className={cn(
          "group relative overflow-hidden border-2 border-surface bg-surface shadow-sm",
          shape === "circle" ? "h-20 w-20 cursor-grab rounded-full" : "h-32 w-full cursor-grab rounded-xl",
          dragging.current && "cursor-grabbing"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {url ? (
          <Image
            src={url}
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: `${pos.x}% ${pos.y}%` }}
            draggable={false}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted">
            <Camera className="h-5 w-5" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-panel/50 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          ) : (
            <Camera className="h-5 w-5 text-white" />
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-1.5 right-1.5 grid h-7 w-7 place-items-center rounded-full border border-white/30 bg-panel/80 text-white hover:bg-panel"
          title="Upload new photo"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
      </div>
      {uploading && (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-brand transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {url && !uploading && (
        <p className="mt-1.5 text-[11px] text-muted">Drag to reposition</p>
      )}
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
