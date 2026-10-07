'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { requireUser } from '@/lib/session';
import { communitySchema, needSchema, slugify } from '@/lib/validation';
import { awardBadge } from '@/server/badges';

async function isManager(userId: string, communityId: string) {
  const m = await prisma.membership.findUnique({ where: { userId_communityId: { userId, communityId } } });
  return m?.role === 'MANAGER' || m?.role === 'OWNER';
}

// ---------- Onboarding ----------
export async function acceptTerms(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect('/connexion');
  if (formData.get('terms') !== 'on') redirect('/bienvenue?erreur=cgu');
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      termsAcceptedAt: new Date(),
      sensitiveConsentAt: formData.get('sensitive') === 'on' ? new Date() : null,
    },
  });
  redirect('/app');
}

// ---------- Swipe ----------
export async function swipe(needId: string, direction: 'LEFT' | 'RIGHT') {
  const user = await requireUser();
  const need = await prisma.need.findFirst({ where: { id: needId, status: 'PUBLISHED' } });
  if (!need) return;
  await prisma.swipe.upsert({
    where: { userId_needId: { userId: user.id, needId } },
    update: { direction },
    create: { userId: user.id, needId, direction },
  });
  if (direction === 'RIGHT') {
    const taken = await prisma.commitment.count({ where: { needId } });
    if (taken >= need.slots) return;
    await prisma.commitment.upsert({
      where: { userId_needId: { userId: user.id, needId } },
      update: {},
      create: { userId: user.id, needId },
    });
    await awardBadge(user.id, 'FIRST_YES');
  }
  revalidatePath('/app/mes-engagements');
}

export async function withdraw(needId: string) {
  const user = await requireUser();
  await prisma.commitment.deleteMany({ where: { userId: user.id, needId, completedAt: null } });
  revalidatePath('/app/mes-engagements');
}

// ---------- Besoins ----------
export async function createNeed(formData: FormData) {
  const user = await requireUser();
  const parsed = needSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/app/besoins/nouveau?erreur=formulaire');
  const d = parsed.data;
  let communityId: string | null = null;
  let status: 'PUBLISHED' | 'PENDING' = 'PUBLISHED';
  if (d.communityId) {
    const member = await prisma.membership.findUnique({
      where: { userId_communityId: { userId: user.id, communityId: d.communityId } },
    });
    if (!member) redirect('/app/besoins/nouveau?erreur=communaute');
    communityId = d.communityId;
    status = member.role === 'MEMBER' ? 'PENDING' : 'PUBLISHED';
  }
  await prisma.need.create({
    data: {
      title: d.title,
      description: d.description,
      category: d.category,
      city: d.city || null,
      startsAt: d.startsAt ? new Date(d.startsAt) : null,
      slots: d.slots,
      authorId: user.id,
      communityId,
      status,
    },
  });
  await awardBadge(user.id, 'ASKER');
  redirect(`/app/mes-besoins?cree=${status === 'PENDING' ? 'attente' : 'publie'}`);
}

export async function reviewNeed(needId: string, approve: boolean) {
  const user = await requireUser();
  const need = await prisma.need.findUnique({ where: { id: needId } });
  if (!need?.communityId) return;
  if (user.role !== 'ADMIN' && !(await isManager(user.id, need.communityId))) return;
  await prisma.need.update({
    where: { id: needId },
    data: { status: approve ? 'PUBLISHED' : 'REJECTED', reviewedById: user.id },
  });
  revalidatePath(`/app/communautes`);
}

/** L'auteur (ou un responsable) confirme le service rendu : points attribués. */
export async function confirmCommitment(commitmentId: string) {
  const user = await requireUser();
  const c = await prisma.commitment.findUnique({ where: { id: commitmentId }, include: { need: true } });
  if (!c || c.completedAt) return;
  const allowed =
    c.need.authorId === user.id ||
    user.role === 'ADMIN' ||
    (c.need.communityId ? await isManager(user.id, c.need.communityId) : false);
  if (!allowed) return;
  await prisma.$transaction([
    prisma.commitment.update({ where: { id: c.id }, data: { completedAt: new Date() } }),
    prisma.user.update({ where: { id: c.userId }, data: { points: { increment: c.need.points } } }),
  ]);
  const done = await prisma.commitment.count({ where: { userId: c.userId, completedAt: { not: null } } });
  await awardBadge(c.userId, 'FIRST_DONE');
  if (done >= 5) await awardBadge(c.userId, 'FIVE_DONE');
  revalidatePath('/app/mes-besoins');
}

export async function closeNeed(needId: string) {
  const user = await requireUser();
  await prisma.need.updateMany({ where: { id: needId, authorId: user.id }, data: { status: 'DONE' } });
  revalidatePath('/app/mes-besoins');
}

// ---------- Communautés ----------
export async function createCommunity(formData: FormData) {
  const user = await requireUser();
  const parsed = communitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect('/app/communautes?erreur=formulaire');
  const base = slugify(parsed.data.name) || 'communaute';
  const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
  const community = await prisma.community.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      city: parsed.data.city || null,
      slug,
      members: { create: { userId: user.id, role: 'OWNER' } },
    },
  });
  await awardBadge(user.id, 'BUILDER');
  redirect(`/app/communautes/${community.slug}`);
}

export async function joinCommunity(formData: FormData) {
  const user = await requireUser();
  const code = String(formData.get('code') ?? '').trim();
  const community = await prisma.community.findUnique({ where: { inviteCode: code } });
  if (!community) redirect('/app/communautes?erreur=code');
  await prisma.membership.upsert({
    where: { userId_communityId: { userId: user.id, communityId: community.id } },
    update: {},
    create: { userId: user.id, communityId: community.id },
  });
  redirect(`/app/communautes/${community.slug}`);
}

export async function setMemberRole(membershipId: string, role: 'MEMBER' | 'MANAGER') {
  const user = await requireUser();
  const m = await prisma.membership.findUnique({ where: { id: membershipId } });
  if (!m || m.role === 'OWNER') return;
  const me = await prisma.membership.findUnique({
    where: { userId_communityId: { userId: user.id, communityId: m.communityId } },
  });
  if (me?.role !== 'OWNER' && user.role !== 'ADMIN') return;
  await prisma.membership.update({ where: { id: membershipId }, data: { role } });
  revalidatePath('/app/communautes');
}

export async function leaveCommunity(communityId: string) {
  const user = await requireUser();
  await prisma.membership.deleteMany({ where: { userId: user.id, communityId, role: { not: 'OWNER' } } });
  redirect('/app/communautes');
}

// ---------- Profil & RGPD ----------
export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      bio: String(formData.get('bio') ?? '').slice(0, 280) || null,
      city: String(formData.get('city') ?? '').slice(0, 80) || null,
      showOnLeaderboard: formData.get('leaderboard') === 'on',
    },
  });
  revalidatePath('/app/profil');
}

export async function deleteAccount() {
  const user = await requireUser();
  await prisma.user.delete({ where: { id: user.id } });
  await signOut({ redirectTo: '/?compte=supprime' });
}

export async function logout() {
  await signOut({ redirectTo: '/' });
}
