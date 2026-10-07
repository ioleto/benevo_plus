import Link from 'next/link';
import { logout } from '@/server/actions';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <><div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#c9a227]/30 pb-4"><Link href="/app" className="font-bold text-[#14213d]">Bénévo<span className="text-[#c9a227]">+</span></Link><nav className="flex flex-wrap gap-3 text-sm"><Link href="/app/besoins/nouveau">Publier</Link><Link href="/app/communautes">Communautés</Link><Link href="/app/profil">Profil</Link><Link href="/app/classement">Classement</Link><form action={logout}><button>Sortir</button></form></nav></div>{children}</>;
}
