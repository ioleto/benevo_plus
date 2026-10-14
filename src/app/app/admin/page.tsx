import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSmtpConfig, publicSmtpConfig } from "@/lib/email";
import SmtpSettings from "@/components/SmtpSettings";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

const sections = [
  { href: "/app/admin/users", title: "Utilisateurs", description: "Comptes, communautés et missions de chaque membre." },
  { href: "/app/admin/besoins", title: "Besoins / missions", description: "Tous les besoins, quel que soit leur statut ou leur communauté." },
  { href: "/app/admin#email", title: "Configuration e-mail", description: "SMTP, test de connexion et e-mail de test." },
  { href: "/app/admin#notifications", title: "Notifications e-mail", description: "Choisir quand prévenir les membres." },
];

export default async function AdminPage() {
  await requireAdmin();
  const [users, needs, smtp] = await Promise.all([
    prisma.user.count(),
    prisma.need.count(),
    getSmtpConfig(),
  ]);
  return <div className="space-y-8">
    <div><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#c9a227]">Administration</p><h1 className="mt-2 text-3xl font-bold">Centre d’administration</h1><p className="mt-2 text-black/60">Pilotez les membres, les missions et les communications de Bénévo+.</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{sections.map(section => <Link key={section.href} href={section.href} className="card block transition hover:-translate-y-0.5 hover:shadow-lg"><h2 className="font-bold">{section.title}</h2><p className="mt-2 text-sm text-black/60">{section.description}</p><span className="mt-4 inline-block text-sm font-semibold text-[#c9a227]">Ouvrir →</span></Link>)}</div>
    <div className="grid gap-4 sm:grid-cols-2"><Link href="/app/admin/users" className="card"><p className="text-sm text-black/60">Utilisateurs</p><p className="mt-1 text-3xl font-bold">{users}</p></Link><Link href="/app/admin/besoins" className="card"><p className="text-sm text-black/60">Besoins / missions</p><p className="mt-1 text-3xl font-bold">{needs}</p></Link></div>
    <section id="email" className="scroll-mt-24"><SmtpSettings initial={publicSmtpConfig(smtp)} /></section>
    <section id="notifications" className="scroll-mt-24"><form action={saveSettings} className="card space-y-5"><div><h2 className="text-xl font-bold">Notifications e-mail</h2><p className="mt-1 text-sm text-black/60">Ces préférences sont globales et sont enregistrées en base. Les variables SMTP restent le secours si aucune configuration n’est enregistrée.</p></div><label className="flex items-center gap-3"><input name="emailEnabled" type="checkbox" defaultChecked className="size-4"/> Activer les e-mails transactionnels</label><div className="grid gap-4 sm:grid-cols-2"><label className="flex items-center gap-3"><input name="notifyMissionAccepted" type="checkbox" defaultChecked className="size-4"/> Mission acceptée</label><label className="flex items-center gap-3"><input name="notifyMessageReceived" type="checkbox" defaultChecked className="size-4"/> Chaque message reçu</label><label className="flex items-center gap-3"><input name="notifyMissionReminder" type="checkbox" defaultChecked className="size-4"/> Rappels avant mission</label><label className="flex items-center gap-3"><input name="notifyMissionPublished" type="checkbox" defaultChecked className="size-4"/> Besoin publié ou validé</label></div><label className="block text-sm">Mode des messages<select name="messageEmailMode" defaultValue="each" className="mt-1 block rounded-xl border p-3"><option value="disabled">Désactivé</option><option value="each">Chaque message</option><option value="digest">Résumé groupé</option></select></label><button className="btn-primary">Enregistrer les notifications</button></form></section>
  </div>;
}
