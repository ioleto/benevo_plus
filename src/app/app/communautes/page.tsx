import { prisma } from "@/lib/prisma";
import CommunityExplorer from "@/components/CommunityExplorer";

export default async function CommunitiesPage() {
  const communities = await prisma.community.findMany({
    where: { visibility: "PUBLIC" }, orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, description: true, city: true, latitude: true, longitude: true, _count: { select: { members: true } } },
  });
  return <main className="space-y-8"><header><p className="text-sm font-semibold uppercase tracking-wide text-[#c9a227]">Explorer</p><h1 className="mt-1 text-3xl font-extrabold text-[#14213d]">Communautés</h1><p className="mt-2 max-w-2xl text-black/70">Trouvez une communauté publique près de chez vous et rejoignez-la avec son code d’accès si elle en demande un.</p></header><CommunityExplorer communities={communities} /></main>;
}
