/* eslint-disable @next/next/no-img-element */
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import UserMenu from "@/components/UserMenu";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: { default: "Bénévo+", template: "%s · Bénévo+" }, description: "Bénévo+ relie les personnes qui ont besoin d'un coup de main et les bénévoles.", manifest: "/manifest.webmanifest", applicationName: "Bénévo+", appleWebApp: { capable: true, title: "Bénévo+", statusBarStyle: "default" }, icons: { icon: "/icon.svg", apple: "/icon.svg" } };
export const viewport: Viewport = { themeColor: "#14213d", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); const user = session?.user;
  return <html lang="fr"><body className="flex min-h-dvh flex-col antialiased"><ServiceWorkerRegistration /><header className="border-b border-slate-200 bg-white"><nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"><Link href={user ? "/app" : "/"} className="text-xl font-bold text-[#14213d]">Bénévo<span className="text-[#c9a227]">+</span></Link>{user ? <UserMenu variant="public" name={user.name} image={user.image} /> : <Link href="/connexion" className="text-sm text-[#14213d] underline-offset-4 hover:underline">Se connecter</Link>}</nav></header><main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main><footer className="border-t border-black/10 py-6 text-center text-xs text-black/60"><div className="flex flex-wrap justify-center gap-4"><Link href="/mentions-legales">Mentions légales</Link><Link href="/cgu">CGU</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/cookies">Cookies</Link></div><p className="mt-2">© {new Date().getFullYear()} Bénévo+ · édité par Ioleto</p></footer></body></html> }
