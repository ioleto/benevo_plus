import type { Metadata } from "next";
import Link from "next/link";
import { signIn } from "../../auth";

export const metadata: Metadata = { title: "Connexion" };

export default function Connexion() {
  return (
    <div className="mx-auto max-w-sm py-10">
      <div className="card text-center">
        <h1 className="text-2xl font-bold">Bienvenue sur Bénévo+</h1>
        <p className="mt-2 text-sm text-black/70">Connectez-vous avec votre compte Google pour continuer.</p>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/app" });
          }}
        >
          <button type="submit" className="btn-primary w-full">Continuer avec Google</button>
        </form>
        <p className="mt-4 text-xs text-black/60">
          En continuant, vous acceptez les <Link href="/cgu" className="underline">CGU</Link> et la{" "}
          <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
  );
}
