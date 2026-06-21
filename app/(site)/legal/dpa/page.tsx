import type { Metadata } from "next";
import { LegalArticle } from "@/components/site/LegalArticle";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ title: "Acuerdo de tratamiento de datos", description: "Condiciones del tratamiento de datos por cuenta de profesionales y empresas que utilizan Regi Kaha.", path: "/legal/dpa" });

export default function DpaPage() {
  return <LegalArticle title="Acuerdo de tratamiento de datos (DPA)" updated="21 de junio de 2026" intro="Este documento complementa los términos aplicables cuando Regi Kaha trata datos personales por cuenta de un profesional o empresa. Los datos identificativos del responsable se obtienen de la configuración legal publicada, sin inventar información fiscal." sections={[
    { h: "Objeto y duración", p: ["El tratamiento se limita a prestar mensajería, gestión de oportunidades, presupuestos, documentos y soporte mientras exista una cuenta activa o una obligación de conservación."] },
    { h: "Categorías de datos", p: ["Pueden tratarse datos de contacto, proyecto, comunicaciones, documentos y actividad. No deben incorporarse categorías especiales salvo necesidad legal documentada."] },
    { h: "Instrucciones y confidencialidad", p: ["Regi Kaha trata los datos conforme a instrucciones documentadas, limita el acceso por función y exige confidencialidad a las personas autorizadas."] },
    { h: "Seguridad y brechas", p: ["Se aplican controles de acceso, cifrado en tránsito, registro de acciones, copias y procedimientos de respuesta. Las incidencias relevantes se comunicarán sin dilación indebida."] },
    { h: "Subencargados y transferencias", p: ["Los proveedores de alojamiento, almacenamiento, correo y pagos se documentan en la configuración legal. Cualquier transferencia internacional debe contar con una base válida."] },
    { h: "Derechos y finalización", p: ["Regi Kaha presta asistencia razonable para atender derechos y, al finalizar, elimina o devuelve datos salvo obligación legal, prevención del fraude o reclamaciones pendientes."] },
  ]} />;
}
