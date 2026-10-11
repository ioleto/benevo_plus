import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';
import { swipe } from '@/server/actions';

const recurrenceLabels: Record<string, string> = { NONE: '', DAILY: 'Chaque jour', WEEKLY: 'Chaque semaine', BIWEEKLY: 'Toutes les deux semaines', MONTHLY: 'Chaque mois' };

export default async function AppHome() {
  const user = await requireUser();
  const needs = await prisma.need.findMany({ where: { status: 'PUBLISHED', authorId: { not: user.id }, swipes: { none: { userId: user.id } } }, include: { community: true, commitments: true }, orderBy: { createdAt: 'desc' }, take: 12 });

  return <div className="space-y-7">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-bold uppercase tracking-[.18em] text-[#c9a227]">Le fil du coup de main</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">À qui dire oui aujourd’hui ?</h1><p className="mt-2 max-w-xl text-slate-600">Des missions près de chez vous, à votre rythme.</p></div>
      <Link href="/app/besoins/nouveau" className="btn-primary">Publier un besoin</Link>
    </div>
    {needs.length === 0 ? <div className="card py-12 text-center"><p className="text-4xl" aria-hidden="true">☀</p><h2 className="mt-4 text-xl font-bold">Le fil est à jour</h2><p className="mx-auto mt-2 max-w-md text-slate-600">Aucune nouvelle mission pour le moment. Revenez bientôt ou publiez votre propre besoin.</p></div> : <div className="grid gap-5 md:grid-cols-2">{needs.map(n => { const full = n.commitments.length >= n.slots; return <article className="card flex flex-col" key={n.id}><div className="flex flex-wrap items-center justify-between gap-2"><span className="badge">{n.category}</span><span className={`badge ${full ? 'badge-muted' : 'badge-gold'}`}>{full ? 'Mission complète' : `+${n.points} pts`}</span></div><h2 className="mt-5 text-xl font-bold">{n.title}</h2><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{n.description}</p><div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-500"><span className="badge-muted">{n.commitments.length}/{n.slots} places</span>{n.recurrence !== 'NONE' && <span className="badge-muted">↻ {recurrenceLabels[n.recurrence]}</span>}<span className="badge-muted">⌖ {n.city ?? 'À proximité'}{n.community ? ` · ${n.community.name}` : ''}</span></div><div className="mt-6 flex gap-3"><form action={swipe.bind(null, n.id, 'LEFT')} className="flex-1"><button className="btn w-full border border-slate-200 text-slate-600 hover:bg-slate-50">Passer</button></form><form action={swipe.bind(null, n.id, 'RIGHT')} className="flex-1"><button className="btn-or w-full" disabled={full}>{full ? 'Complète' : 'J’aide !'}</button></form></div></article>; })}</div>}
  </div>;
}
