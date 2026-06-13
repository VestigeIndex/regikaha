"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Revela su contenido con una animación suave (fade + slide-up) cuando entra en
 * el viewport. Usa IntersectionObserver y se desactiva solo si el usuario
 * prefiere menos movimiento. La ocultación inicial está gateada por la clase
 * `.js` del <html>, así que sin JavaScript el contenido se ve siempre.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={visible ? "true" : "false"}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </Tag>
  );
}
