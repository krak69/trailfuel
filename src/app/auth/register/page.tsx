"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const supabase = React.useMemo(createClient, []);
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    // Option : créer une ligne vide dans profiles ici côté client
    // mais on le fera côté page /account si elle n'existe pas.
    if (data.user) {
      router.push("/account");
      router.refresh();
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Créer un compte</h1>
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
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Confirmer le mot de passe</span>
          <input
            type="password"
            className="border rounded-lg px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Création…" : "Créer mon compte"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Déjà inscrit ?{" "}
        <Link href="/auth/login" className="underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
