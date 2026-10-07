import type { Metadata } from "next";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function Confidentialite() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
      <h2 className="text-xl font-semibold">Responsable du traitement</h2>
      <p>Eloi TOURANGIN (Ioleto), 5 rue Principale, 49370 La Pouëze — contact@ioleto.fr.</p>
      <h2 className="text-xl font-semibold">Données collectées</h2>
      <ul className="list-disc pl-6">
        <li>Compte : nom, adresse e-mail et photo transmis par Google.</li>
        <li>Activité : besoins publiés, engagements, points, badges, communautés rejointes.</li>
        <li>Appartenance à une communauté religieuse : donnée sensible (art. 9 RGPD), traitée uniquement avec votre consentement explicite, retirable à tout moment.</li>
      </ul>
      <h2 className="text-xl font-semibold">Finalités et bases légales</h2>
      <p>Fourniture du service (exécution des CGU), sécurité et modération (intérêt légitime), données sensibles (consentement explicite).</p>
      <h2 className="text-xl font-semibold">Destinataires</h2>
      <p>Les données ne sont ni vendues ni cédées. Seuls les autres utilisateurs concernés voient les informations nécessaires à la mise en relation. Google intervient uniquement pour l’authentification.</p>
      <h2 className="text-xl font-semibold">Durée de conservation</h2>
      <p>Jusqu’à la suppression du compte, puis suppression définitive sous 30 jours. Les comptes inactifs depuis 3 ans sont supprimés après avertissement.</p>
      <h2 className="text-xl font-semibold">Vos droits</h2>
      <p>Accès, rectification, effacement, portabilité (export depuis votre profil), opposition, limitation et retrait du consentement : écrivez à contact@ioleto.fr. Vous pouvez saisir la CNIL (www.cnil.fr).</p>
      <h2 className="text-xl font-semibold">Hébergement</h2>
      <p>Les données sont hébergées en France sur les serveurs de l’éditeur.</p>
    </article>
  );
}
