import { redirect } from "next/navigation";

// L'ancienne page /app/fil est remplacée par l'accueil /app.
export default function FilRedirect() {
  redirect("/app");
}
