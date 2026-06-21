import type { Metadata } from "next";
import MercadosPage from "../mercados/page";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Países con cobertura",
  description: "Consulta los países activos de Regi Kaha y accede a la búsqueda por ciudades, localidades, categorías y radio de servicio.",
  path: "/paises",
});

export default MercadosPage;
