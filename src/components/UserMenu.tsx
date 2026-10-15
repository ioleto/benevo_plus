"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/server/actions";

type UserMenuProps = { variant?: "public" | "app"; name?: string | null; image?: string | null; isAdmin?: boolean };
function initials(name?: string | null) { return (name || "B").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }

export default function UserMenu({ variant = "app", name, image, isAdmin }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, []);
  useEffect(() => { const close = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, []);
  const publicMenu = variant === "public";
  const linkClass = publicMenu ? "block rounded-lg px-3 py-2 hover:bg-black/5" : "menu-link";
  return <div ref={menuRef} className="relative">
    <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="menu" className={publicMenu ? "flex cursor-pointer items-center gap-2" : "flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#14213d] shadow-sm outline-none ring-[#c9a227] transition hover:shadow-md focus-visible:ring-2"}>
      <span className={publicMenu ? "flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#c9a227] font-bold text-[#14213d]" : "grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#14213d]"}>{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : <span className={publicMenu ? "" : "text-xs font-bold text-[#c9a227]"}>{initials(name)}</span>}</span>
      <span className="hidden sm:inline">{publicMenu ? (name || "Mon compte") : "Mon espace"}</span>{!publicMenu && <span aria-hidden="true">⌄</span>}
    </button>
    {open && <div className={publicMenu ? "absolute right-0 z-50 mt-2 w-52 rounded-xl bg-white p-2 text-sm text-[#14213d] shadow-xl" : "absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"} role="menu">
      {(publicMenu ? [["Mon profil","/app/profil"],["Mes communautés","/app/communautes"],["Paramètres","/app/profil#parametres"]] : [["Mon profil","/app/profil"],["Mes engagements","/app/mes-engagements"],["Mes besoins","/app/mes-besoins"],["Mes discussions","/app/discussions"], ...(isAdmin ? [["Administration","/app/admin"]] : [])]).map(([label, href]) => <Link key={href} onClick={() => setOpen(false)} href={href} className={linkClass}>{label}</Link>)}
      <form action={logout} className={publicMenu ? "" : "mt-1 border-t border-slate-100 pt-1"}><button type="submit" onClick={() => setOpen(false)} className={publicMenu ? "w-full rounded-lg px-3 py-2 text-left hover:bg-black/5" : "menu-link w-full text-left text-red-700"}>Se déconnecter</button></form>
    </div>}
  </div>;
}
