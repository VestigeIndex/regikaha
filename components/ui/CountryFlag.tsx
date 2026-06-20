export function CountryFlag({
  country,
  label,
  className,
}: {
  country: string;
  label: string;
  className?: string;
}) {
  const code = country.trim().toLowerCase();
  return (
    <span
      className={`inline-flex h-4 w-5 shrink-0 overflow-hidden rounded-[3px] bg-white shadow-[0_0_0_1px_rgba(15,92,74,0.16)] ${className || ""}`}
      aria-label={label}
      role="img"
    >
      <Image src={`/flags/${code}.svg`} alt="" width={28} height={20} className="h-full w-full object-cover" unoptimized />
    </span>
  );
}
import Image from "next/image";
