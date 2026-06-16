"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { site } from "@/lib/site";
import { BadgeCheck } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function Footer() {
  const t = useT();
  const trustPoints = [t.trust.verified, t.trust.realReviews, t.trust.noPaidRanking, t.trust.freeForClients];
  return (
    <footer className="mt-24 border-t hairline bg-canvas">
      <div className="container-x py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(5,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-sm text-muted leading-relaxed">
              {t.ui.footer.tagline}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {trustPoints.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 text-xs text-forest-800 bg-mint rounded-full px-2.5 py-1 ring-1 ring-forest-600/12">
                  <BadgeCheck size={13} className="text-forest-600" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {t.ui.footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-muted hover:text-forest-700 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t hairline flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {site.name}. {t.ui.footer.rights}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {t.ui.footer.bottomLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-muted hover:text-forest-700">{link.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
