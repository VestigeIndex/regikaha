import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: { name: string; path?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero border-b hairline">
      <div className="absolute inset-0 bg-grid-soft bg-grid opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      <div className="container-x relative py-12 lg:py-16">
        {breadcrumbs && (
          <div className="mb-5">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-[2rem] sm:text-4xl lg:text-[2.8rem] font-bold tracking-tight text-ink text-balance max-w-3xl">
          {title}
        </h1>
        {description && <p className="mt-4 text-lg text-muted leading-relaxed max-w-2xl">{description}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
