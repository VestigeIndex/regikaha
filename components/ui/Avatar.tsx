import { cn } from "@/lib/utils";

/** Avatar con iniciales sobre el color de marca del profesional. */
export function Avatar({
  name,
  color,
  src,
  size = 48,
  className,
}: {
  name: string;
  color: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <span
        className={cn("block overflow-hidden rounded-2xl bg-white shadow-soft shrink-0", className)}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={cn("grid place-items-center rounded-2xl font-bold text-white shadow-soft shrink-0", className)}
      style={{ background: color, width: size, height: size, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
