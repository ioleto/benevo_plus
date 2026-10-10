import { z } from 'zod';

export const CATEGORIES = [
  'Liturgie', 'Accueil', 'Ménage & entretien', 'Bricolage', 'Cuisine & repas',
  'Transport', 'Solidarité', 'Enfants & catéchèse', 'Musique & chant', 'Autre',
] as const;

export const needSchema = z.object({
  title: z.string().trim().min(4).max(120), description: z.string().trim().min(10).max(2000),
  category: z.enum(CATEGORIES), city: z.string().trim().max(80).optional().or(z.literal('')),
  startsAt: z.string().optional().or(z.literal('')), slots: z.coerce.number().int().min(1).max(50),
  minSlots: z.coerce.number().int().min(1).max(50).optional().or(z.literal('')),
  recurrence: z.enum(['NONE', 'DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).default('NONE'),
  recurrenceEnd: z.string().optional().or(z.literal('')), communityId: z.string().optional().or(z.literal('')),
});
export const communitySchema = z.object({ name: z.string().trim().min(3).max(100), description: z.string().trim().max(1000).optional().or(z.literal('')), city: z.string().trim().max(80).optional().or(z.literal('')) });
export function slugify(input: string) { return input.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60); }
