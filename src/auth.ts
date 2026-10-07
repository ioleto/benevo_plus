import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

function normalizeBaseUrl(value: string | undefined) {
  if (!value) return value;
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, '');
}

for (const key of ['AUTH_URL', 'NEXTAUTH_URL'] as const) {
  const normalized = normalizeBaseUrl(process.env[key]);
  if (normalized) process.env[key] = normalized;
}

const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: 'database' },
  pages: { signIn: '/connexion' },
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (dbUser && adminEmail && dbUser.email?.toLowerCase() === adminEmail && dbUser.role !== 'ADMIN') {
        await prisma.user.update({ where: { id: dbUser.id }, data: { role: 'ADMIN' } });
        dbUser.role = 'ADMIN';
      }
      session.user.id = user.id;
      session.user.role = dbUser?.role ?? 'USER';
      session.user.onboarded = Boolean(dbUser?.termsAcceptedAt);
      return session;
    },
  },
});
