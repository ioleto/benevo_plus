/** Auréoles : paliers de points, avec une pointe d'humour. */
export const HALOS = [
  { min: 0, name: 'Bonne volonté', emoji: '🕯️' },
  { min: 30, name: 'Petit coup de main', emoji: '🤲' },
  { min: 100, name: 'Pilier de sacristie', emoji: '⛪' },
  { min: 250, name: 'Auréole en rodage', emoji: '😇' },
  { min: 500, name: 'Saint patron du coup de main', emoji: '✨' },
] as const;

export function haloFor(points: number) {
  return [...HALOS].reverse().find((h) => points >= h.min) ?? HALOS[0];
}

export function nextHalo(points: number) {
  return HALOS.find((h) => h.min > points) ?? null;
}

export const BADGES: Record<string, { label: string; emoji: string; description: string }> = {
  FIRST_YES: { label: 'Premier « oui »', emoji: '🙋', description: 'Premier engagement sur un besoin.' },
  FIRST_DONE: { label: 'Mission accomplie', emoji: '✅', description: 'Premier service rendu et validé.' },
  FIVE_DONE: { label: 'Fidèle au poste', emoji: '🔔', description: 'Cinq services rendus.' },
  BUILDER: { label: 'Bâtisseur', emoji: '🧱', description: 'A créé une communauté.' },
  ASKER: { label: 'Humble demandeur', emoji: '📣', description: 'A publié un premier besoin.' },
};
