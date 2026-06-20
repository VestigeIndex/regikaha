import { cn } from "@/lib/utils";

export function CountryFlag({
  country,
  label,
  className,
}: {
  country: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        `fi fi-${country.trim().toLowerCase()}`,
        "inline-flex h-4 w-5 shrink-0 rounded-[3px] bg-cover bg-center shadow-[0_0_0_1px_rgba(15,92,74,0.16)]",
        className,
      )}
      aria-label={label}
      role="img"
    />
  );
}
