import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { updateProfile, deleteAccount } from "@/server/actions";
export default async function Profil() {
  const u = await requireUser();
  const db = await prisma.user.findUniqueOrThrow({
    where: { id: u.id },
    include: { badges: true },
  });
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-3xl font-bold">{db.name ?? "Mon profil"}</h1>
      <form action={updateProfile} className="card space-y-3">
        <input name="firstName" defaultValue={db.firstName ?? ""} />
        <input name="lastName" defaultValue={db.lastName ?? ""} />
        <label>
          <input
            type="checkbox"
            name="emailNotifications"
            defaultChecked={db.emailNotificationsEnabled}
          />{" "}
          Recevoir les notifications e-mail
        </label>
        <button className="btn-primary">Enregistrer</button>
      </form>
      <form action={deleteAccount}>
        <button className="btn">Supprimer mon compte</button>
      </form>
    </div>
  );
}
