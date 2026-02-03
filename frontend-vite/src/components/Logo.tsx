import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/** Navbar/app logo. Uses public/logo.png when available; falls back to Heart icon. */
export function Logo({
  className,
  size = 40,
  showFallbackBox = true,
}: {
  className?: string;
  size?: number;
  showFallbackBox?: boolean;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-primary-500 text-white shadow-soft",
          showFallbackBox && "bg-primary-500",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Heart className="h-[55%] w-[55%]" aria-hidden />
      </span>
    );
  }

  return (
    <span className={cn("relative shrink-0 overflow-hidden rounded-xl", className)} style={{ width: size, height: size }}>
      <img
        src="/logo.png"
        alt="MedAI"
        width={size}
        height={size}
        className="object-contain"
        onError={() => setError(true)}
      />
    </span>
  );
}
