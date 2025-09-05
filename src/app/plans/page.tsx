// src/app/plans/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import PlansTable from "./ui/PlansTable";

export const metadata = {
  title: "Mes plans | TrailFuel",
};

export default async function PlansIndexPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .eq("user_id", user.id)
    .order("start_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    // Affichage minimal d'erreur – on laisse la page se rendre
    console.error("Failed to load plans:", error.message);
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Mes plans</h1>
        <Link
          href="/plans/new"
          className="rounded-lg bg-black px-4 py-2 text-white"
        >
          Nouveau plan
        </Link>
      </div>

      <PlansTable initialPlans={plans ?? []} />
    </div>
  );
}
