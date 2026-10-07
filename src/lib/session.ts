import { redirect } from 'next/navigation';
import { auth } from '@/auth';

/** Exige un utilisateur connecté et ayant accepté les CGU. */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect('/connexion');
  if (!session.user.onboarded) redirect('/bienvenue');
  return session.user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') redirect('/app');
  return user;
}
