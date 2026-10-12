import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import {
  saveSettings,
  sendTestEmail,
  suspendUser,
  deleteCommunity,
} from "./actions";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  await requireAdmin();
  const [users, communities, logs] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.community.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 30 }),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Centre d’administration</h1>
      <form action={saveSettings} className="card space-y-3">
        <label>
          <input name="emailEnabled" type="checkbox" defaultChecked /> E-mails
          activés
        </label>
        <label>
          Mode messages{" "}
          <select name="messageEmailMode" defaultValue="disabled">
            <option value="disabled">Désactivé</option>
            <option value="each">Chaque message</option>
            <option value="digest">Résumé groupé</option>
          </select>
        </label>
        <button className="btn-primary">Enregistrer</button>
      </form>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="card">
          <h2 className="text-xl font-bold">Utilisateurs</h2>
          {users.map((u) => (
            <div key={u.id} className="flex justify-between border-b py-2">
              {u.email || u.name}
              {!u.suspended && (
                <form action={suspendUser}>
                  <input type="hidden" name="id" value={u.id} />
                  <ConfirmSubmitButton message="Suspendre cet utilisateur ?">
                    Suspendre
                  </ConfirmSubmitButton>
                </form>
              )}
            </div>
          ))}
        </section>
        <section className="card">
          <h2 className="text-xl font-bold">Communautés</h2>
          {communities.map((c) => (
            <div key={c.id} className="flex justify-between border-b py-2">
              {c.name}
              <form action={deleteCommunity}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmSubmitButton message="Supprimer définitivement cette communauté ?">
                  Supprimer
                </ConfirmSubmitButton>
              </form>
            </div>
          ))}
        </section>
      </div>
      <section className="card">
        <h2 className="text-xl font-bold">E-mail de test & journal</h2>
        <form action={sendTestEmail} className="flex gap-2">
          <input name="to" type="email" required />
          <button className="btn-or">Envoyer</button>
        </form>
        {logs.map((l) => (
          <p key={l.id}>
            {l.to} · {l.subject} · {l.status}
          </p>
        ))}
      </section>
    </div>
  );
}
