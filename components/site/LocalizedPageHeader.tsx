"use client";

import { PageHeader } from "@/components/site/PageHeader";
import { useT } from "@/lib/i18n/context";

type HeaderKey = "search" | "map" | "publishProject" | "publishSubcontract" | "builders" | "subcontractors";

export function LocalizedPageHeader({
  id,
  children,
}: {
  id: HeaderKey;
  children?: React.ReactNode;
}) {
  const t = useT();
  const header = t.ui.pageHeaders[id];

  return (
    <PageHeader
      eyebrow={header.eyebrow}
      title={header.title}
      description={header.description}
      breadcrumbs={[{ name: t.ui.common.home, path: "/" }, { name: header.breadcrumb }]}
    >
      {children}
    </PageHeader>
  );
}
