"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

type Suggestion = { label: string; city: string; latitude: number; longitude: number };

export default function CityAutocomplete({ city = "", latitude = null, longitude = null }: { city?: string; latitude?: number | null; longitude?: number | null }) {
  const [value, setValue] = useState(city);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ latitude, longitude });
  const listId = useId(); const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const request = useRef<AbortController | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); request.current?.abort(); }, []);
  const search = (term: string) => { setValue(term); setActive(-1); if (timer.current) clearTimeout(timer.current); if (term.trim().length < 2) { setSuggestions([]); return; } timer.current = setTimeout(async () => { request.current?.abort(); request.current = new AbortController(); setLoading(true); try { const response = await fetch(`/api/geocode?q=${encodeURIComponent(term.trim())}`, { signal: request.current.signal }); const data = await response.json(); setSuggestions(data.features ?? []); } catch (error) { if ((error as Error).name !== "AbortError") setSuggestions([]); } finally { setLoading(false); } }, 300); };
  const choose = (item: Suggestion) => { setValue(item.city); setCoordinates({ latitude: item.latitude, longitude: item.longitude }); setSuggestions([]); setActive(-1); };
  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => { if (!suggestions.length) return; if (event.key === "ArrowDown") { event.preventDefault(); setActive((current) => (current + 1) % suggestions.length); } if (event.key === "ArrowUp") { event.preventDefault(); setActive((current) => (current - 1 + suggestions.length) % suggestions.length); } if (event.key === "Enter" && active >= 0) { event.preventDefault(); choose(suggestions[active]); } if (event.key === "Escape") setSuggestions([]); };
  return <div className="relative"><label htmlFor={listId} className="sr-only">Ville</label><input id={listId} name="city" value={value} onChange={(event) => search(event.target.value)} onKeyDown={onKeyDown} onBlur={() => setTimeout(() => setSuggestions([]), 150)} placeholder="Ville" autoComplete="off" role="combobox" aria-expanded={suggestions.length > 0} aria-controls={`${listId}-list`} aria-activedescendant={active >= 0 ? `${listId}-option-${active}` : undefined} className="w-full rounded-xl border p-3" /><input type="hidden" name="latitude" value={coordinates.latitude ?? ""} /><input type="hidden" name="longitude" value={coordinates.longitude ?? ""} />{loading && <span className="absolute right-3 top-3 text-xs text-black/50" aria-live="polite">Recherche…</span>}{suggestions.length > 0 && <ul id={`${listId}-list`} role="listbox" className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border bg-white p-1 shadow-xl">{suggestions.map((item, index) => <li id={`${listId}-option-${index}`} role="option" aria-selected={index === active} key={`${item.label}-${index}`}><button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item)} className={`w-full rounded-lg px-3 py-2 text-left text-sm ${index === active ? "bg-slate-100" : "hover:bg-slate-50"}`}>{item.label}</button></li>)}</ul>}</div>;
}
