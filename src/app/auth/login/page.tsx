"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const supabase = React.useMemo(createClient, []);
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/account");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Connexion</h1>
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
        <label className="grid gap-1">
          <span className="text-sm">Mot de passe</span>
          <input
            type="password"
            className="border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        {/* lien mot de passe oublié */}
        <div className="mt-1">
          <Link href="/auth/reset" className="text-sm underline">
            Mot de passe oublié ?
          </Link>
        </div>
      </form>

      <p className="mt-4 text-sm">
        Pas de compte ?{" "}
        <Link href="/auth/register" className="underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
