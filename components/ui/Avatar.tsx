import { cn } from "@/lib/utils";

/** Avatar con iniciales sobre el color de marca del profesional. */
export function Avatar({
  name,
  color,
  size = 48,
  className,
}: {
  name: string;
  color: string;
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
