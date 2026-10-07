import Link from "next/link";

const etapes = [
  { titre: "Publiez un besoin", texte: "Courses, transport à la messe, visite à une personne seule, petit bricolage…" },
  { titre: "Swipez pour aider", texte: "Les bénévoles parcourent les besoins proches et choisissent ceux qu’ils peuvent rendre." },
  { titre: "Gagnez votre auréole", texte: "Chaque service confirmé rapporte des points et des badges, pour la joie de servir." },
];

export default function Accueil() {
  return (
    <div className="space-y-12">
      <section className="py-10 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">
          Rendre service, <span className="text-[#c9a227]">simplement</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-black/70">
          « Portez les fardeaux les uns des autres » (Ga 6,2). Bénévo+ met en lien ceux qui ont besoin d’aide et
          ceux qui veulent donner un peu de leur temps, dans leur paroisse, leur association ou leur quartier.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/connexion" className="btn-primary">Je m’inscris</Link>
          <Link href="/connexion" className="btn-or">Je publie un besoin</Link>
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        {etapes.map((e, i) => (
          <div key={e.titre} className="card">
            <div className="text-3xl font-bold text-[#c9a227]">{i + 1}</div>
            <h2 className="mt-2 text-lg font-semibold">{e.titre}</h2>
            <p className="mt-1 text-sm text-black/70">{e.texte}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
