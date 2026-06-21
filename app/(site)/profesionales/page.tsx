import type { Metadata } from "next";
import BuscarPage from "../buscar/page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Profesionales por zona y especialidad",
  description: "Busca profesionales, empresas y subcontratas por país, localidad, categoría, idioma, distancia y disponibilidad.",
  path: "/profesionales",
});

export default BuscarPage;
