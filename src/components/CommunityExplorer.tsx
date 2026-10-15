"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const CommunityMap = dynamic(() => import("./CommunityMap"), { ssr: false });

type Community = { id:string; name:string; slug:string; description:string|null; city:string|null; latitude:number|null; longitude:number|null; _count:{members:number} };
export default function CommunityExplorer({ communities }: { communities: Community[] }) {
  const [query, setQuery] = React.useState("");
  const [city, setCity] = React.useState("");
  const filtered = communities.filter((c) => `${c.name} ${c.description || ""}`.toLowerCase().includes(query.toLowerCase()) && (!city || (c.city || "").toLowerCase().includes(city.toLowerCase())));
  return <><div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2"><label className="text-sm font-semibold">Rechercher<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Nom ou description" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label><label className="text-sm font-semibold">Ville<input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="Paris, Lyon…" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal" /></label></div><div className="grid gap-4 md:grid-cols-2">{filtered.map(c=><article key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-[#14213d]">{c.name}</h2><p className="text-sm text-black/60">{c.city || "Ville non renseignée"} · {c._count.members} membre{c._count.members > 1 ? "s" : ""}</p></div><span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Publique</span></div><p className="mt-3 text-sm text-black/70">{c.description || "Aucune description."}</p><Link className="btn-primary mt-4 inline-block" href={`/app/communautes/${c.id}`}>Découvrir</Link></article>)}</div>{filtered.length===0 && <p className="rounded-xl bg-slate-50 p-6 text-center text-black/60">Aucune communauté ne correspond à votre recherche.</p>}<div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"><div className="p-4"><h2 className="font-bold text-[#14213d]">Carte des communautés</h2><p className="text-sm text-black/60">Les communautés peuvent renseigner leurs coordonnées pour apparaître sur OpenStreetMap.</p></div><CommunityMap communities={filtered} /></div></>;
}
