import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountRegisterForm } from "@/components/auth/AccountRegisterForm";
import { RegistrationRoleIntro } from "@/components/auth/RegistrationRoleIntro";
import { RegistroForm } from "@/components/marketplace/RegistroForm";
import { buildMetadata } from "@/lib/seo";
import { registrationRoleCopy, type RegistrationRouteRole } from "@/lib/i18n/registration-role";

const roles = ["cliente", "profesional", "empresa", "subcontrata"] as const;
type RouteRole = RegistrationRouteRole;

export function generateStaticParams() {
  return roles.map((role) => ({ role }));
}

const accountRoles = { cliente: "client", empresa: "company", subcontrata: "subcontractor" } as const;

export async function generateMetadata({ params }: { params: Promise<{ role: string }> }): Promise<Metadata> {
  const { role } = await params;
  if (!roles.includes(role as RouteRole)) return { title: "Registro no encontrado" };
  const item = registrationRoleCopy("es", role as RouteRole);
  return buildMetadata({ title: item.title, description: item.text, path: `/registro/${role}` });
}

export default async function RegistroRolePage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params;
  if (!roles.includes(role as RouteRole)) notFound();
  const routeRole = role as RouteRole;
  const accountRole = routeRole === "profesional" ? undefined : accountRoles[routeRole];
  return (
    <>
      <RegistrationRoleIntro role={routeRole} />
      <section className="container-x py-10 sm:py-14">
        {routeRole === "profesional" || !accountRole ? <RegistroForm /> : <AccountRegisterForm role={accountRole} />}
      </section>
    </>
  );
}
