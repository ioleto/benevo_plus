"use client";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

type Community = {
  id: string;
  name: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  _count: { members: number };
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export default function CommunityMap({ communities }: { communities: Community[] }) {
  const node = useRef<HTMLDivElement>(null);
  const hasLocated = communities.some((c) => c.latitude !== null && c.longitude !== null);

  useEffect(() => {
    let map: LeafletMap | undefined;
    let cancelled = false;

    const load = async () => {
      if (!node.current || !hasLocated) return;
      const L = (await import("leaflet")).default;
      if (cancelled || !node.current) return;
      const located = communities.filter((c) => c.latitude !== null && c.longitude !== null);
      const instance = L.map(node.current).setView([46.6, 2.4], 5);
      map = instance;
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(instance);
      located.forEach((c) => {
        const members = c._count.members;
        L.marker([c.latitude as number, c.longitude as number])
          .addTo(instance)
          .bindPopup(
            `<strong>${escapeHtml(c.name)}</strong><br>${members} membre${members > 1 ? "s" : ""}<br><a href="/app/communautes/${encodeURIComponent(c.id)}">Découvrir</a>`,
          );
      });
    };

    load().catch(() => {});
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [communities, hasLocated]);

  if (!hasLocated) {
    return (
      <p className="rounded-xl bg-slate-50 p-5 text-sm text-black/60">
        Aucune communauté avec coordonnées à afficher sur la carte.
      </p>
    );
  }
  return <div ref={node} className="h-96 w-full" aria-label="Carte des communautés publiques" />;
}
