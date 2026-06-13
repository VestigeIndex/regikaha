import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto max-w-2xl", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="text-[1.7rem] sm:text-3xl lg:text-[2.1rem] font-bold tracking-tight text-ink text-balance">
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3 text-muted leading-relaxed", align === "center" ? "" : "max-w-2xl")}>
          {description}
        </p>
      )}
    </div>
  );
}
