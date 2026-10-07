import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mentions légales" };

export default function MentionsLegales() {
  return (
    <article className="prose max-w-none space-y-4">
      <h1 className="text-3xl font-bold">Mentions légales</h1>
      <h2 className="text-xl font-semibold">Éditeur</h2>
      <p>
        Bénévo+ est édité par Eloi TOURANGIN, entrepreneur individuel (micro-entreprise) exerçant sous le nom commercial
        Ioleto.<br />Adresse : 5 rue Principale, 49370 La Pouëze, France<br />SIRET : 921 062 766 00016<br />
        TVA non applicable, art. 293 B du CGI.<br />Contact : <a href="mailto:contact@ioleto.fr">contact@ioleto.fr</a>
      </p>
      <h2 className="text-xl font-semibold">Directeur de la publication</h2>
      <p>Eloi TOURANGIN.</p>
      <h2 className="text-xl font-semibold">Hébergement</h2>
      <p>Le service est auto-hébergé par l’éditeur sur ses propres serveurs, à l’adresse ci-dessus.</p>
      <h2 className="text-xl font-semibold">Propriété intellectuelle</h2>
      <p>
        Les éléments du site (marque, logo, textes, code) sont la propriété de l’éditeur. Les contenus publiés par les
        utilisateurs restent sous leur responsabilité.
      </p>
    </article>
  );
}
