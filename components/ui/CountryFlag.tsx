/* eslint-disable @next/next/no-img-element */

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
      className={`relative inline-flex h-4 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[3px] bg-white text-[8px] font-bold uppercase leading-none text-forest-700 shadow-[0_0_0_1px_rgba(15,92,74,0.16)] ${className || ""}`}
      aria-label={label}
      role="img"
    >
      <span aria-hidden="true">{code}</span>
      <img src={`/flags/${code}.svg`} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />
    </span>
  );
}
