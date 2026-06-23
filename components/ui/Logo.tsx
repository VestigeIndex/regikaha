import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, mono = false, compact = false }: { className?: string; mono?: boolean; compact?: boolean }) {
  const textColor = mono ? "text-white" : "text-ink";
  const accent = mono ? "text-mint" : "text-forest-600";
  return (
    <Link href="/" className={cn("group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap", className)} aria-label="RegiKaha inicio">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-2xl bg-forest-700 shadow-soft ring-1 ring-white/30">
        <span className="absolute -right-2 -top-2 h-7 w-7 rounded-full bg-mint/40" />
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="relative">
          <path d="M6 14.6 16 6.4l10 8.2" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8.6 13.4v10.2h14.8V13.4" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m11.8 18.4 2.7 2.7 5.7-5.9" stroke="#8CE6B0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {!compact && (
        <span className={cn("whitespace-nowrap text-[1.28rem] font-extrabold leading-none tracking-[-0.03em]", textColor)}>
          Regi<span className={accent}>Kaha</span>
        </span>
      )}
    </Link>
  );
}
