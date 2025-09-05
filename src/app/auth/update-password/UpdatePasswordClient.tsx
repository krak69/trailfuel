"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordClient() {
  const supabase = React.useMemo(createClient, []);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [sessionReady, setSessionReady] = React.useState(false);

  // Récupération du code/token dans l’URL après clic sur l’email
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setErr(null);

      // Nouveau format Supabase → ?code=...
      const code = searchParams?.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (cancelled) return;
        if (error) {
          setErr(error.message || "Lien invalide ou expiré.");
          setSessionReady(false);
          return;
        }
        setSessionReady(true);
        return;
      }

      // Ancien format Supabase → #access_token & refresh_token
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash?.startsWith("#")) {
        const h = new URLSearchParams(hash.slice(1));
        const access_token = h.get("access_token");
        const refresh_token = h.get("refresh_token");
        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (cancelled) return;
          if (error) {
            setErr(error.message || "Lien invalide ou expiré.");
            setSessionReady(false);
            return;
          }
          setSessionReady(true);
          return;
        }
      }

      // Rien trouvé dans l’URL
      setErr("Lien de réinitialisation invalide ou expiré.");
      setSessionReady(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, supabase]);

  // Soumission du nouveau mot de passe
  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErr(null);

    if (password !== confirm) {
      setErr("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setErr(error.message);
    } else {
      setMsg("Mot de passe mis à jour ✅");
      setTimeout(() => router.push("/auth/login"), 1000);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">Nouveau mot de passe</h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Nouveau mot de passe</span>
          <input
            type="password"
            className="border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Confirmer</span>
          <input
            type="password"
            className="border rounded-lg px-3 py-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        {!sessionReady && (
          <p className="text-sm text-red-600">
            {err ??
              "Auth session missing! Ouvre cette page via le lien reçu par email."}
          </p>
        )}
        {err && sessionReady && <p className="text-sm text-red-600">{err}</p>}
        {msg && <p className="text-sm text-green-700">{msg}</p>}

        <button
          type="submit"
          disabled={loading || !sessionReady}
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}
