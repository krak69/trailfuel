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

    // Détermine l'origine (local ou prod)
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Enlève un éventuel slash final et construit l’URL complète
    const redirectTo = `${origin.replace(/\/$/, "")}/auth/update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setErr(error.message);
    } else {
      setMsg(
        "Un e-mail de réinitialisation vient d’être envoyé. Clique sur le lien reçu pour définir ton nouveau mot de passe ✅"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-4">
        Réinitialiser le mot de passe
      </h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Adresse e-mail</span>
          <input
            type="email"
            className="border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
