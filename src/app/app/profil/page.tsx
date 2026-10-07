import Link from "next/link";
import { requireUser } from "../../../server/session";
import { updateProfile } from "../../../server/actions";

export default async function ProfilePage() {
  const user = await requireUser();
  return <div className="mx-auto max-w-3xl space-y-6"><div><p className="text-sm uppercase tracking-[.2em] text-[#c9a227]">Compte</p><h1 className="text-3xl font-bold">Mon profil</h1></div><section className="card"><h2 className="text-xl font-bold">Informations publiques</h2><form action={updateProfile} className="mt-4 space-y-4"><textarea name="bio" defaultValue={user.bio ?? ''} placeholder="Quelques mots sur vous" className="min-h-28 w-full rounded-xl border p-3" maxLength={280}/><input name="city" defaultValue={user.city ?? ''} placeholder="Ville" className="w-full rounded-xl border p-3" maxLength={80}/><label className="flex gap-2"><input type="checkbox" name="leaderboard" defaultChecked={user.showOnLeaderboard}/> Apparaître dans le classement</label><button className="btn-or">Enregistrer</button></form></section><section id="parametres" className="card"><h2 className="text-xl font-bold">Paramètres</h2><p className="mt-2 text-sm text-black/60">Gérez vos préférences et vos données personnelles.</p><div className="mt-4 flex flex-wrap gap-3"><Link className="btn" href="/api/me/export">Exporter mes données</Link><Link className="btn" href="/confidentialite">Confidentialité</Link></div></section></div>;
}
