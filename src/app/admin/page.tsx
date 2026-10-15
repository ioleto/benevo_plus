import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function AdminPage() { await requireAdmin(); redirect("/app/admin"); }
