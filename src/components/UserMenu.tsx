"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logout } from "@/server/actions";

type UserMenuProps = {
  variant?: "public" | "app";
  name?: string | null;
  image?: string | null;
  isAdmin?: boolean;
};

function initials(name?: string | null) {
  return (name || "B").split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function UserMenu({ variant = "app", name, image, isAdmin }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const closeOnOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("touchstart", closeOnOutside);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("touchstart", closeOnOutside);
    };
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  const publicMenu = variant === "public";
  return (
    <div ref={menuRef} className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-haspopup="menu" className={publicMenu ? "flex cursor-pointer items-center gap-2" : "flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#14213d] shadow-sm outline-none ring-[#c9a227] transition hover:shadow-md focus-visible:ring-2"}>
        {publicMenu ? (
          <><span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#c9a227] font-bold text-[#14213d]">{image ? <img src={image} alt="" className="h-full w-full object-cover" /> : initials(name)}</span><span className="hidden text-sm sm:inline">{name || "Mon compte"}</span></>
        ) : (
          <><span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-[#14213d]" aria-hidden="true"><img src="/icon.svg" alt="" className="h-7 w-7" /></span><span className="hidden sm:inline">Mon espace</span><span aria-hidden="true">⌄</span></>
        )}
      </button>
      {open && (
        <div className={publicMenu ? "absolute right-0 mt-2 w-52 rounded-xl bg-white p-2 text-sm text-[#14213d] shadow-xl" : "absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"} role="menu">
          {publicMenu ? <>
            <Link onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/app/profil">Mon profil</Link>
            <Link onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/app/communautes">Mes communautés</Link>
            <Link onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-black/5" href="/app/profil#parametres">Paramètres</Link>
          </> : <>
            <Link onClick={() => setOpen(false)} href="/app/profil" className="menu-link">Mon profil</Link>
            <Link onClick={() => setOpen(false)} href="/app/mes-engagements" className="menu-link">Mes engagements</Link>
            <Link onClick={() => setOpen(false)} href="/app/mes-besoins" className="menu-link">Mes besoins</Link>
            <Link onClick={() => setOpen(false)} href="/app/discussions" className="menu-link">Mes discussions</Link>
            {isAdmin && <Link onClick={() => setOpen(false)} href="/app/admin" className="menu-link">Administration</Link>}
          </>}
          <form action={logout} onClick={() => setOpen(false)} className={publicMenu ? "" : "mt-1 border-t border-slate-100 pt-1"}>
            <button className={publicMenu ? "w-full rounded-lg px-3 py-2 text-left hover:bg-black/5" : "menu-link w-full text-left text-red-700"} type="submit">Se déconnecter</button>
          </form>
        </div>
      )}
    </div>
  );
}
