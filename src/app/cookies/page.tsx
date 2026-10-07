import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookies" };

export default function Cookies() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">Politique cookies</h1>
      <p>Bénévo+ n'utilise <strong>aucun cookie publicitaire ni de mesure d'audience</strong>.</p>
      <p>Seuls des cookies strictement nécessaires sont déposés, exemptés de consentement (art. 82 loi Informatique et Libertés) :</p>
      <ul className="list-disc pl-6">
        <li><code>authjs.session-token</code> : maintien de votre session (30 jours).</li>
        <li><code>authjs.csrf-token</code> : protection contre la falsification de requêtes (session).</li>
        <li><code>authjs.callback-url</code> : redirection après connexion (session).</li>
      </ul>
      <p>Vous pouvez les supprimer depuis votre navigateur, mais vous serez alors déconnecté.</p>
    </article>
  );
}
