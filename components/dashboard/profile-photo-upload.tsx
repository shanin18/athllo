"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { Camera, Loader2, X, Eye, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_SIZE_MB = 5;
const CLICK_DRAG_THRESHOLD = 4;

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
  label,
  className,
}: {
  table: "athlete_profiles" | "sponsor_profiles";
  column: "avatar_url" | "cover_url" | "logo_url";
  posColumn: "avatar_pos" | "cover_pos" | "logo_pos";
  userId: string;
  initialUrl: string | null;
  initialPos?: string | null;
  shape?: "circle" | "banner";
  label?: string;
  className?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [pos, setPos] = useState(parsePos(initialPos ?? null));
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const moved = useRef(false);
  const startPoint = useRef({ x: 0, y: 0 });

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
    const rawX = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const rawY = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setPos({ x: 100 - rawX, y: 100 - rawY });
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
    moved.current = false;
    startPoint.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = Math.abs(e.clientX - startPoint.current.x);
    const dy = Math.abs(e.clientY - startPoint.current.y);
    if (dx > CLICK_DRAG_THRESHOLD || dy > CLICK_DRAG_THRESHOLD) {
      moved.current = true;
      updatePosFromEvent(e.clientX, e.clientY);
    }
  }
  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    if (moved.current) {
      persistPos(pos.x, pos.y);
    } else {
      setMenuOpen((v) => !v);
    }
  }

  function handleClickEmpty() {
    if (url) return;
    inputRef.current?.click();
  }

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div
        ref={boxRef}
        className={cn(
          "group relative overflow-hidden border border-line bg-surface shadow-sm",
          shape === "circle" ? "h-20 w-20 rounded-full" : "h-32 w-full rounded-xl",
          url ? (dragging.current && moved.current ? "cursor-grabbing" : "cursor-grab") : "cursor-pointer"
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onClick={handleClickEmpty}
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
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-muted">
            <Camera className="h-5 w-5" />
            {label && shape === "banner" && <span className="text-xs font-medium">{label}</span>}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-panel/40 opacity-0 transition-opacity group-hover:opacity-100">
          {uploading && <Loader2 className="h-5 w-5 animate-spin text-white" />}
        </div>
      </div>

      {menuOpen && url && (
        <PhotoMenu
          anchorRef={wrapperRef}
          onClose={() => setMenuOpen(false)}
          onView={() => {
            setMenuOpen(false);
            setViewerOpen(true);
          }}
          onUpload={() => {
            setMenuOpen(false);
            inputRef.current?.click();
          }}
        />
      )}

      {viewerOpen && url && <PhotoViewer url={url} onClose={() => setViewerOpen(false)} />}

      {uploading && (
        <div className="mt-2 h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-surface">
          <div
            className="h-full bg-brand transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {error && <p className="mt-1.5 text-xs text-energy">{error}</p>}
    </div>
  );
}

function PhotoMenu({
  anchorRef,
  onClose,
  onView,
  onUpload,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onView: () => void;
  onUpload: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      setCoords({ top: rect.bottom + 8, left: rect.left + rect.width / 2 });
    }
  }, [anchorRef]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      const insideAnchor = anchorRef.current?.contains(target);
      const insideMenu = menuRef.current?.contains(target);
      if (!insideAnchor && !insideMenu) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [anchorRef, onClose]);

  if (!mounted || !coords) return null;

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lg"
      style={{ top: coords.top, left: coords.left }}
    >
      <button
        type="button"
        onClick={onView}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-brand-wash"
      >
        <Eye className="h-4 w-4" /> View full photo
      </button>
      <button
        type="button"
        onClick={onUpload}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-brand-wash"
      >
        <Upload className="h-4 w-4" /> Upload new photo
      </button>
    </div>,
    document.body
  );
}

function PhotoViewer({ url, onClose }: { url: string; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={url}
        alt=""
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
}
