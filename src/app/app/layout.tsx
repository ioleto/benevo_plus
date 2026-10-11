import Link from 'next/link';
import UserMenu from '@/components/UserMenu';

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
          <UserMenu />
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
