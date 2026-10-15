/** Adresses autorisées à administrer l’application.
 * ADMIN_EMAIL est le nom actuel ; ADMIN_EMAILS conserve la compatibilité avec les anciens déploiements.
 */
export function configuredAdminEmails(): string[] {
  return [process.env.ADMIN_EMAIL, process.env.ADMIN_EMAILS]
    .flatMap((value) => (value || '').split(','))
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

export function isConfiguredAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && configuredAdminEmails().includes(email.trim().toLowerCase()));
}
