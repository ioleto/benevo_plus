import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-3xl font-bold">Page introuvable</h1>
      <p className="mt-2 text-black/70">Cette page n&apos;existe pas ou a été déplacée.</p>
      <Link href="/" className="btn-primary mt-6">Retour à l&apos;accueil</Link>
    </div>
  );
}



