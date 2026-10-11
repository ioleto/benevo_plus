import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/session';
import { updateNeed } from '@/server/actions';
import { CATEGORIES } from '@/lib/validation';

export default async function ModifierBesoin({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const need = await prisma.need.findUnique({ where: { id } });
  if (!need || need.authorId !== user.id) notFound();
  return <div className="mx-auto max-w-2xl"><Link href="/app/mes-besoins" className="text-sm underline">← Mes besoins</Link><h1 className="mt-4 text-3xl font-bold">Modifier le besoin</h1><form action={updateNeed.bind(null, need.id)} className="card mt-6 space-y-4"><input name="title" required defaultValue={need.title} className="w-full rounded-xl border p-3"/><textarea name="description" required defaultValue={need.description} className="min-h-32 w-full rounded-xl border p-3"/><div className="grid gap-4 sm:grid-cols-2"><select name="category" defaultValue={need.category} className="rounded-xl border p-3">{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><input name="city" defaultValue={need.city ?? ''} placeholder="Ville" className="rounded-xl border p-3"/><input name="startsAt" type="datetime-local" defaultValue={need.startsAt ? new Date(need.startsAt.getTime() - need.startsAt.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''} className="rounded-xl border p-3"/><input name="slots" type="number" min="1" defaultValue={need.slots} className="rounded-xl border p-3"/><input name="minSlots" type="number" min="1" defaultValue={need.minSlots ?? ''} placeholder="Minimum (optionnel)" className="rounded-xl border p-3"/><select name="recurrence" defaultValue={need.recurrence} className="rounded-xl border p-3"><option value="NONE">Pas de récurrence</option><option value="DAILY">Chaque jour</option><option value="WEEKLY">Chaque semaine</option><option value="BIWEEKLY">Toutes les deux semaines</option><option value="MONTHLY">Chaque mois</option></select><input name="recurrenceEnd" type="date" defaultValue={need.recurrenceEnd?.toISOString().slice(0, 10) ?? ''} className="rounded-xl border p-3"/></div><button className="btn-or">Enregistrer</button></form></div>;
}
