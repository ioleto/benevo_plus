import Link from 'next/link';
import { logout } from '@/server/actions';
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <><div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#c9a227]/30 pb-4"><Link href="/app" className="font-bold text-[#14213d]">Bénévo<span className="text-[#c9a227]">+</span></Link><nav className="hidden flex-wrap gap-3 text-sm sm:flex"><Link href="/app/besoins/nouveau">Publier</Link><Link href="/app/communautes">Communautés</Link><Link href="/app/classement">Classement</Link></nav></div>{children}<nav className="fixed bottom-0 left-0 right-0 z-10 flex justify-around border-t bg-white/95 p-3 text-xs shadow-lg sm:hidden"><Link href="/app">Accueil</Link><Link href="/app/besoins/nouveau">Publier</Link><Link href="/app/communautes">Communautés</Link><Link href="/app/profil">Profil</Link></nav></>;
}
