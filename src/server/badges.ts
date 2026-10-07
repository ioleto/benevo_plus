import { prisma } from '@/lib/prisma';

export async function awardBadge(userId: string, badge: string) {
  await prisma.userBadge.upsert({
    where: { userId_badge: { userId, badge } },
    update: {},
    create: { userId, badge },
  });
}
