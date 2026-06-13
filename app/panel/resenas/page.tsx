import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { getProfessionalById, getReviewsByProfessional } from "@/lib/data";
import { ReviewCard } from "@/components/marketplace/ReviewCard";
import { Star, MessageSquare } from "lucide-react";

const ME = "pro-reformas-costa";

export default function ResenasPage() {
  const pro = getProfessionalById(ME)!;
  const reviews = getReviewsByProfessional(ME);
  const replied = reviews.filter((r) => r.reply).length;

  return (
    <>
      <DashboardHeader title="Valoraciones" subtitle="Responde a tus clientes. No se pueden borrar reseñas legítimas." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<Star size={19} />} label="Valoración media" value={`${pro.averageRating}/5`} />
        <StatCard icon={<MessageSquare size={19} />} label="Reseñas" value={pro.reviewCount} />
        <StatCard icon={<MessageSquare size={19} />} label="Respondidas" value={`${replied}/${reviews.length}`} />
        <StatCard icon={<Star size={19} />} label="Verificadas" value="100%" />
      </div>

      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id}>
            <ReviewCard review={r} professionalName={pro.publicName} />
            {!r.reply && (
              <div className="mt-2 ml-1 pl-3 border-l-2 border-forest-200">
                <button className="btn btn-secondary text-sm py-1.5">Responder a esta reseña</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
