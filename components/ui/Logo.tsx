import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logotipo Regi Kaha: marca de obra/hoja en verde + wordmark. */
export function Logo({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group", className)} aria-label="Regi Kaha — inicio">
      <span
        className="grid place-items-center h-9 w-9 rounded-xl shadow-soft"
        style={{ background: mono ? "rgba(255,255,255,0.16)" : "var(--gradient-brand)" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 11.5 12 4l8 7.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10.5V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-8.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 20v-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span
        className={cn(
          "text-[1.25rem] font-bold tracking-tight",
          mono ? "text-white" : "text-ink",
        )}
      >
        Regi <span className={mono ? "text-mint" : "text-forest-600"}>Kaha</span>
      </span>
    </Link>
  );
}
