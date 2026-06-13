import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="container-x py-5">
        <Logo />
      </header>
      <main className="flex-1 grid place-items-center px-6">
        <div className="text-center max-w-md">
          <p className="text-7xl font-bold text-gradient">404</p>
          <h1 className="mt-4 text-2xl font-bold text-ink">Página no encontrada</h1>
          <p className="mt-3 text-muted leading-relaxed">
            La página que buscas no existe o se ha movido. Vuelve al inicio o busca el profesional que necesitas.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary"><Home size={16} /> Volver al inicio</Link>
            <Link href="/buscar" className="btn btn-secondary"><Search size={16} /> Buscar profesionales</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
