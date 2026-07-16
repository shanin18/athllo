import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  seed,
  size = 40,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const src = `https://api.dicebear.com/9.x/glass/png?seed=${encodeURIComponent(seed)}&size=${size * 2}`;
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full border border-line bg-surface", className)}
      style={{ width: size, height: size }}
    />
  );
}
