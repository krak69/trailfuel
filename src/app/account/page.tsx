import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import AccountForm from "./ui/AccountForm";

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch profil (s’il n’existe pas, on renverra null et le form créera l’entry)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-2">Mon compte</h1>
      <p className="text-sm text-black/70 mb-6">
        Identifiant : {user.email}
      </p>
      {/* Formulaire client */}
      <AccountForm userId={user.id} initialProfile={profile ?? null} />
    </div>
  );
}
