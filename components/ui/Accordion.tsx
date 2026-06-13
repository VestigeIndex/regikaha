export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.q} className="card p-5 group">
          <summary className="font-medium text-ink cursor-pointer list-none flex items-center justify-between gap-3">
            {item.q}
            <span className="text-forest-500 text-xl leading-none group-open:rotate-45 transition-transform shrink-0">+</span>
          </summary>
          <p className="mt-3 text-sm text-muted leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
