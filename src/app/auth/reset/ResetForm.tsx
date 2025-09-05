"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function ResetForm() {
  const searchParams = useSearchParams();

  const { token, email } = useMemo(() => ({
    token: searchParams.get("token") ?? "",
    email: searchParams.get("email") ?? "",
  }), [searchParams]);

  return (
    <main className="container-wide py-16">
      <h1 className="text-3xl font-bold mb-6">Réinitialiser le mot de passe</h1>
      <div className="card p-6 max-w-md">
        {/* Placeholder de formulaire — branchement à Supabase à faire */}
        <div className="space-y-4 text-sm opacity-80">
          <div>token: <code>{token || "(absent)"}</code></div>
          <div>email: <code>{email || "(absent)"}</code></div>
        </div>
      </div>
    </main>
  );
}
