import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBand({
  title,
  text,
  primary,
  secondary,
}: {
  title: string;
  text?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-brand text-white p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-grid-soft bg-grid opacity-10" />
        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance max-w-2xl mx-auto">{title}</h2>
          {text && <p className="mt-3 text-white/85 max-w-xl mx-auto leading-relaxed">{text}</p>}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href={primary.href} className="btn btn-white text-base">
              {primary.label} <ArrowRight size={18} />
            </Link>
            {secondary && (
              <Link href={secondary.href} className="btn text-base text-white ring-1 ring-white/30 hover:bg-white/10">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
