import Link from "next/link";
import { auth } from "@/auth";
import UserMenu from "@/components/UserMenu";
const navigation = [
  { href: "/app", label: "Accueil" },
  { href: "/app/besoins/nouveau", label: "Publier" },
  { href: "/app/communautes", label: "Communautés" },
  { href: "/app/classement", label: "Classement" },
  { href: "/app/discussions", label: "Discussions" },
];
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      <header className="sticky top-0 z-20 -mx-4 mb-8 border-b border-slate-200/80 bg-[#fbf7ef]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/app"
            className="text-lg font-extrabold tracking-tight text-[#14213d]"
          >
            Bénévo<span className="text-[#c9a227]">+</span>
          </Link>
          <nav className="hidden items-center gap-1 lg:flex">
            {navigation.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-slate-600"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <UserMenu isAdmin={isAdmin} name={session?.user?.name} image={session?.user?.image} />
        </div>
      </header>
      <main className="mx-auto max-w-6xl">{children}</main>
    </div>
  );
}
