import Link from 'next/link';
import { logout } from '@/server/actions';

const navigation = [
  { href: '/app', label: 'Accueil' },
  { href: '/app/besoins/nouveau', label: 'Publier' },
  { href: '/app/communautes', label: 'Communautés' },
  { href: '/app/classement', label: 'Classement' },
  { href: '/app/discussions', label: 'Discussions' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      <header className="sticky top-0 z-20 -mx-4 mb-8 border-b border-slate-200/80 bg-[#fbf7ef]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/app" className="text-lg font-extrabold tracking-tight text-[#14213d]" aria-label="Bénévo+, accueil">
            Bénévo<span className="text-[#c9a227]">+</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {navigation.slice(1).map((item) => (
              <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-[#14213d]">
                {item.label}
              </Link>
            ))}
          </nav>
          <details className="relative">
            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#14213d] shadow-sm outline-none ring-[#c9a227] transition hover:shadow-md focus-visible:ring-2">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#14213d] text-xs text-white" aria-hidden="true">♡</span>
              <span className="hidden sm:inline">Mon espace</span>
              <span aria-hidden="true">⌄</span>
            </summary>
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <Link href="/app/profil" className="menu-link">Mon profil</Link>
              <Link href="/app/mes-engagements" className="menu-link">Mes engagements</Link>
              <Link href="/app/mes-besoins" className="menu-link">Mes besoins</Link>
              <Link href="/app/discussions" className="menu-link">Mes discussions</Link>
              <form action={logout} className="mt-1 border-t border-slate-100 pt-1">
                <button className="menu-link w-full text-left text-red-700" type="submit">Se déconnecter</button>
              </form>
            </div>
          </details>
        </div>
      </header>
      <main className="mx-auto max-w-6xl">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 border-t border-slate-200 bg-white/95 p-2 shadow-[0_-8px_30px_rgba(20,33,61,0.08)] backdrop-blur sm:hidden" aria-label="Navigation mobile">
        {navigation.slice(0, 4).map((item, index) => (
          <Link key={item.href} href={item.href} className="flex min-h-12 flex-col items-center justify-center rounded-xl text-[11px] font-semibold text-slate-500 transition hover:bg-[#fbf7ef] hover:text-[#14213d]">
            <span className="mb-0.5 text-base" aria-hidden="true">{['⌂', '+', '♧', '✦'][index]}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
