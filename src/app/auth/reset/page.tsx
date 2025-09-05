"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetRequestPage() {
  const supabase = React.useMemo(createClient, []);
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`, // IMPORTANT
    });
    setLoading(false);

    if (error) setErr(error.message);
    else setMsg("E-mail envoyé. Clique sur le lien pour définir un nouveau mot de passe.");
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Réinitialiser le mot de passe</h1>
      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Email</span>
          <input
            type="email"
            className="border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        {err && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Envoi…" : "Envoyer le lien"}
        </button>
      </form>
    </div>
  );
}
