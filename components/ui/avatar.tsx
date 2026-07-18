import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  seed,
  src: srcProp,
  size = 40,
  className,
  style,
}: {
  seed: string;
  src?: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const src =
    srcProp ||
    `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(seed)}&size=${size * 2}&backgroundType=solid&fontWeight=600`;
  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full border border-line bg-surface object-cover", className)}
      style={{ width: size, height: size, ...style }}
    />
  );
}
