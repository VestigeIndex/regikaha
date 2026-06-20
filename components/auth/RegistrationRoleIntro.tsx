"use client";

import Image from "next/image";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { useI18n } from "@/lib/i18n/context";
import { registrationLabels, registrationRoleCopy, type RegistrationRouteRole } from "@/lib/i18n/registration-role";

const roleImages: Partial<Record<RegistrationRouteRole, string>> = {
  profesional: "/images/photos/fachada.webp",
  empresa: "/images/photos/mantenimiento.webp",
  subcontrata: "/images/photos/pavimentacion.webp",
};

export function RegistrationRoleIntro({ role }: { role: RegistrationRouteRole }) {
  const { locale } = useI18n();
  const labels = registrationLabels[locale];
  const copy = registrationRoleCopy(locale, role);
  const image = roleImages[role];

  return (
    <>
      <PageHeader
        eyebrow={labels.registration}
        title={copy.title}
        description={copy.text}
        breadcrumbs={[{ name: labels.home, path: "/" }, { name: labels.registration, path: "/registro" }, { name: copy.title }]}
      >
        {role === "profesional" && (
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-500/10 px-3 py-1 text-xs font-semibold text-forest-800">
            <Sparkles size={14} /> {copy.founder}
          </span>
        )}
      </PageHeader>
      {image && (
        <section className="container-x pt-10 sm:pt-14">
          <div className="relative mx-auto min-h-64 max-w-4xl overflow-hidden rounded-lg sm:min-h-80">
            <Image src={image} alt={copy.text} fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-0 max-w-xl p-6 text-lg font-semibold text-white sm:p-8 sm:text-xl">{copy.text}</p>
          </div>
        </section>
      )}
    </>
  );
}
