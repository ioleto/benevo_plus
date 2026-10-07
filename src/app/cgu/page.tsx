import type { Metadata } from "next";

export const metadata: Metadata = { title: "Conditions générales d'utilisation" };

export default function Cgu() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Conditions générales d'utilisation</h1>
      <p className="text-sm text-black/60">En vigueur au 7 octobre 2026.</p>
      <h2 className="text-xl font-semibold">1. Objet</h2>
      <p>Bénévo+ est une plateforme gratuite de mise en relation entre personnes ayant un besoin d'aide et bénévoles, au sein de communautés (paroisses, associations…) ou en public.</p>
      <h2 className="text-xl font-semibold">2. Inscription</h2>
      <p>L'inscription se fait via un compte Google. L'utilisateur s'engage à fournir des informations exactes.</p>
      <h2 className="text-xl font-semibold">3. Gratuité et bénévolat</h2>
      <p>Les services rendus sont bénévoles. Toute rémunération, demande d'argent ou démarchage commercial est interdit. Les points et badges n'ont aucune valeur monétaire.</p>
      <h2 className="text-xl font-semibold">4. Publication et modération</h2>
      <p>Les besoins publiés dans une communauté sont soumis à la validation de ses responsables. Les besoins publics sont publiés directement. L'éditeur peut retirer tout contenu illicite, injurieux ou contraire aux présentes CGU et suspendre le compte concerné.</p>
      <h2 className="text-xl font-semibold">5. Responsabilité</h2>
      <p>Bénévo+ n'est qu'un intermédiaire technique. Les rencontres et services se déroulent sous la seule responsabilité des utilisateurs. Soyez prudents : privilégiez les lieux publics pour une première rencontre et ne communiquez jamais de données bancaires.</p>
      <h2 className="text-xl font-semibold">6. Suppression du compte</h2>
      <p>L'utilisateur peut supprimer son compte à tout moment depuis son profil.</p>
      <h2 className="text-xl font-semibold">7. Droit applicable</h2>
      <p>Les présentes CGU sont soumises au droit français. Contact : contact@ioleto.fr.</p>
    </article>
  );
}
