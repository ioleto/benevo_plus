import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { isConfiguredAdminEmail } from "@/lib/admin-config";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  pages: { signIn: "/connexion" },
  callbacks: {
    async session({ session, user }) {
      const db = await prisma.user.findUnique({ where: { id: user.id } });
      if (
        db?.email &&
        isConfiguredAdminEmail(db.email) &&
        db.role !== "ADMIN"
      )
        await prisma.user.update({
          where: { id: db.id },
          data: { role: "ADMIN" },
        });
      session.user.id = user.id;
      session.user.role = isConfiguredAdminEmail(db?.email)
        ? "ADMIN"
        : (db?.role ?? "USER");
      session.user.onboarded = Boolean(db?.termsAcceptedAt);
      return session;
    },
  },
});
