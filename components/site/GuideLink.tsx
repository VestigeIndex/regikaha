import Link from "next/link";
import { useDirectTranslation } from "@/lib/i18n/useDirectTranslation";

export function GuideLink({ className }: { className?: string }) {
  const { translate } = useDirectTranslation();

  return (
    <Link href="/ayuda" className={className}>
      {translate("Ayuda")}
    </Link>
  );
}
