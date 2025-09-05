// src/app/account/page.tsx
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import AccountForm from "./ui/AccountForm";

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });
    const again = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    profile = again.data ?? null;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-2">Mon compte</h1>
      <p className="text-sm text-black/70 mb-6">Identifiant : {user.email}</p>
      <AccountForm userId={user.id} initialProfile={profile} />
    </div>
  );
}
