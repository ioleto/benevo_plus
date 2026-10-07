import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

/** Droit à la portabilité (art. 20 RGPD) : export JSON des données personnelles. */
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true, bio: true, city: true, points: true,
      showOnLeaderboard: true, termsAcceptedAt: true, sensitiveConsentAt: true, createdAt: true,
      memberships: { select: { role: true, joinedAt: true, community: { select: { name: true } } } },
      needsCreated: { select: { title: true, description: true, status: true, createdAt: true } },
      commitments: { select: { createdAt: true, completedAt: true, need: { select: { title: true } } } },
      swipes: { select: { direction: true, createdAt: true, needId: true } },
      badges: { select: { badge: true, earnedAt: true } },
    },
  });
  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="benevo-plus-mes-donnees.json"',
    },
  });
}
