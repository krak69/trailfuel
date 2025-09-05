"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  sex: "male" | "female" | "other" | null;
  weight_kg: number | null;
  height_cm: number | null;
  age_years: number | null;
  objectifs: string | null;
  allure_base: string | null;
} | null;

export default function AccountForm({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: Profile;
}) {
  const supabase = React.useMemo(createClient, []);
  const [sex, setSex] = React.useState<"male" | "female" | "other" | "">(
    initialProfile?.sex ?? ""
  );
  const [weight, setWeight] = React.useState<string>(
    initialProfile?.weight_kg?.toString() ?? ""
  );
  const [height, setHeight] = React.useState<string>(
    initialProfile?.height_cm?.toString() ?? ""
  );
  const [age, setAge] = React.useState<string>(
    initialProfile?.age_years?.toString() ?? ""
  );
  const [objectifs, setObjectifs] = React.useState<string>(
    initialProfile?.objectifs ?? ""
  );
  const [allure, setAllure] = React.useState<string>(
    initialProfile?.allure_base ?? ""
  );

  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  const onSave: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setMsg(null);

    const payload = {
      id: userId,
      sex: (sex || null) as "male" | "female" | "other" | null,
      weight_kg: weight ? Number(weight) : null,
      height_cm: height ? Number(height) : null,
      age_years: age ? Number(age) : null,
      objectifs: objectifs || null,
      allure_base: allure || null,
    };

    // upsert (insert si n'existe pas, update sinon)
    const { error } = await supabase.from("profiles").upsert(payload, {
      onConflict: "id",
    });

    setSaving(false);
    if (error) {
      setErr(error.message);
    } else {
      setMsg("Profil enregistré ✅");
    }
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <form onSubmit={onSave} className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Sexe</span>
          <select
            className="border rounded-lg px-3 py-2"
            value={sex}
            onChange={(e) =>
              setSex(e.target.value as "male" | "female" | "other" | "")
            }
          >
            <option value="">—</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
            <option value="other">Autre</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Âge (années)</span>
          <input
            type="number"
            min={0}
            className="border rounded-lg px-3 py-2"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="ex. 34"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Poids (kg)</span>
          <input
            type="number"
            min={0}
            step="0.1"
            className="border rounded-lg px-3 py-2"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="ex. 68.5"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Taille (cm)</span>
          <input
            type="number"
            min={0}
            step="0.1"
            className="border rounded-lg px-3 py-2"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="ex. 178"
          />
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-sm">Objectifs</span>
        <textarea
          className="border rounded-lg px-3 py-2"
          rows={3}
          value={objectifs}
          onChange={(e) => setObjectifs(e.target.value)}
          placeholder="Ex : SaintéLyon 2025 en 12h, amélioration D+…"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Allure de base (ex. 5:30 / km)</span>
        <input
          className="border rounded-lg px-3 py-2"
          value={allure}
          onChange={(e) => setAllure(e.target.value)}
          placeholder="mm:ss / km"
        />
      </label>

      {err && <p className="text-red-600 text-sm">{err}</p>}
      {msg && <p className="text-green-700 text-sm">{msg}</p>}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg border px-4 py-2"
        >
          Se déconnecter
        </button>
      </div>
    </form>
  );
}
