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
          <path d="M6.5 15.2 16 7l9.5 8.2" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.2 14.4v9.2h13.6v-9.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 23.6v-5.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M20.6 10.5c3.7.5 5.2 3.1 4.7 5.9-.5 2.9-3.2 4.8-6.6 4.6 1.8-1.3 2.7-3.1 2.7-5.1 0-1.9-.7-3.7-2.1-5.2.4-.1.8-.2 1.3-.2Z" fill="#BDF6D2" />
          <path d="M12.2 15.8c1.4-1.1 3.4-.9 4.5.5 1.1 1.4.9 3.4-.5 4.5" stroke="#BDF6D2" strokeWidth="1.9" strokeLinecap="round" />
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
