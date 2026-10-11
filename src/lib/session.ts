import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
export async function requireUser(){const session=await auth();if(!session?.user)redirect('/connexion');if(!session.user.onboarded)redirect('/app/bienvenue');const dbUser=await prisma.user.findUnique({where:{id:session.user.id},select:{suspended:true}});if(dbUser?.suspended)redirect('/connexion?suspendu=1');return session.user;}
export async function requireAdmin(){const {requireAdmin:check}=await import('@/lib/admin');return check();}
