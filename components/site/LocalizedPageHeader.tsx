"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    document.title = `${header.title} | RegiKaha`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = header.description;
  }, [header.description, header.title]);

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
