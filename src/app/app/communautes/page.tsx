import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';
import { createCommunity, joinCommunity } from '@/server/actions';
import CommunityExplorer from '@/components/CommunityExplorer';
import CityAutocomplete from '@/components/CityAutocomplete';

export default async function CommunitiesPage() {
  const user = await requireUser();
  const [communities, memberships] = await Promise.all([
    prisma.community.findMany({ where: { visibility: 'PUBLIC' }, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, slug: true, description: true, city: true, latitude: true, longitude: true, _count: { select: { members: true } } } }),
    prisma.membership.findMany({ where: { userId: user.id }, include: { community: true }, orderBy: { joinedAt: 'desc' } }),
  ]);
  return <main className="space-y-8"><header><p className="text-sm font-semibold uppercase tracking-wide text-[#c9a227]">Explorer</p><h1 className="mt-1 text-3xl font-extrabold text-[#14213d]">Communautés</h1><p className="mt-2 max-w-2xl text-black/70">Trouvez une communauté publique près de chez vous, ou créez la vôtre.</p></header>
    {memberships.length > 0 && <section><h2 className="mb-3 text-2xl font-bold">Mes communautés</h2><div className="grid gap-4 md:grid-cols-2">{memberships.map((m) => <Link href={`/app/communautes/${m.community.id}`} className="card block" key={m.id}><h3 className="text-xl font-bold">{m.community.name}</h3><p className="text-sm text-black/60">{m.role} · {m.community.city ?? 'Lieu non précisé'}</p></Link>)}</div></section>}
    <CommunityExplorer communities={communities} />
    <section className="grid gap-4 md:grid-cols-2"><form action={joinCommunity} className="card space-y-3"><h2 className="text-xl font-bold">Rejoindre</h2><input name="code" required placeholder="Code d’invitation" className="w-full rounded-xl border p-3"/><button className="btn-primary">Rejoindre</button></form><form action={createCommunity} className="card space-y-3"><h2 className="text-xl font-bold">Créer une communauté</h2><input name="name" required placeholder="Nom" className="w-full rounded-xl border p-3"/><CityAutocomplete /><textarea name="description" placeholder="Description" className="min-h-28 w-full rounded-xl border p-3"/><button className="btn-or">Créer</button></form></section>
  </main>;
}
