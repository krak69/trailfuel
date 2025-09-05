"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;

  // MVP (compte)
  sex?: "male" | "female" | "other" | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  age_years?: number | null;
  objectifs?: string | null;
  allure_base?: string | null;

  diet_type?: string | null;     // omnivore | vegetarian | vegan | other
  allergens?: string[] | null;
  consent_data?: boolean | null;

  // V1/V2 (compte)
  sweat_rate_lph_cool?: number | null;
  sweat_rate_lph_hot?: number | null;
  sodium_loss_mg_per_l?: number | null;
  heat_acclimated?: boolean | null;
  caffeine_sensitivity?: string | null; // low|medium|high
  gi_tolerance_score?: number | null;   // 1..5
  best_10k_time?: string | null;        // 'hh:mm:ss'
  best_half_time?: string | null;
  best_marathon_time?: string | null;
} | null;

const DIET_OPTIONS = ["omnivore", "vegetarian", "vegan", "other"] as const;
const CAFFEINE_SENSITIVITY = ["low", "medium", "high"] as const;

function parseCSV(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}
function joinCSV(arr: string[] | null | undefined): string {
  return Array.isArray(arr) ? arr.join(", ") : "";
}
function toIntOrNull(v: string): number | null {
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}
function toFloatOrNull(v: string): number | null {
  if (!v) return null;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

export default function AccountForm({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: Profile;
}) {
  const supabase = React.useMemo(createClient, []);

  // ========= MVP (compte) =========
  const [sex, setSex] = React.useState<"male" | "female" | "other" | "">(
    (initialProfile?.sex as any) ?? ""
  );
  const [weight, setWeight] = React.useState<string>(
    initialProfile?.weight_kg != null ? String(initialProfile.weight_kg) : ""
  );
  const [height, setHeight] = React.useState<string>(
    initialProfile?.height_cm != null ? String(initialProfile.height_cm) : ""
  );
  const [age, setAge] = React.useState<string>(
    initialProfile?.age_years != null ? String(initialProfile.age_years) : ""
  );
  const [objectifs, setObjectifs] = React.useState<string>(
    initialProfile?.objectifs ?? ""
  );
  const [allure, setAllure] = React.useState<string>(
    initialProfile?.allure_base ?? ""
  );

  const [dietType, setDietType] = React.useState<string>(
    initialProfile?.diet_type ?? "omnivore"
  );
  const [allergensText, setAllergensText] = React.useState<string>(
    joinCSV(initialProfile?.allergens)
  );
  const [consentData, setConsentData] = React.useState<boolean>(
    initialProfile?.consent_data ?? false
  );

  // ========= V1/V2 (compte) =========
  const [sweatCool, setSweatCool] = React.useState<string>(
    initialProfile?.sweat_rate_lph_cool != null
      ? String(initialProfile.sweat_rate_lph_cool)
      : ""
  );
  const [sweatHot, setSweatHot] = React.useState<string>(
    initialProfile?.sweat_rate_lph_hot != null
      ? String(initialProfile.sweat_rate_lph_hot)
      : ""
  );
  const [sodiumLoss, setSodiumLoss] = React.useState<string>(
    initialProfile?.sodium_loss_mg_per_l != null
      ? String(initialProfile.sodium_loss_mg_per_l)
      : ""
  );
  const [heatAcclimated, setHeatAcclimated] = React.useState<boolean>(
    initialProfile?.heat_acclimated ?? false
  );
  const [caffeineSensitivity, setCaffeineSensitivity] = React.useState<string>(
    initialProfile?.caffeine_sensitivity ?? ""
  );
  const [giTolerance, setGiTolerance] = React.useState<string>(
    initialProfile?.gi_tolerance_score != null
      ? String(initialProfile.gi_tolerance_score)
      : ""
  );
  const [best10k, setBest10k] = React.useState<string>(
    initialProfile?.best_10k_time ?? ""
  );
  const [bestHalf, setBestHalf] = React.useState<string>(
    initialProfile?.best_half_time ?? ""
  );
  const [bestMarathon, setBestMarathon] = React.useState<string>(
    initialProfile?.best_marathon_time ?? ""
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

      // MVP (compte)
      sex: (sex || null) as "male" | "female" | "other" | null,
      weight_kg: toFloatOrNull(weight),
      height_cm: toFloatOrNull(height),
      age_years: toIntOrNull(age),
      objectifs: objectifs || null,
      allure_base: allure || null,

      diet_type: dietType || null,
      allergens: parseCSV(allergensText),
      consent_data: consentData,

      // V1/V2 (compte)
      sweat_rate_lph_cool: toFloatOrNull(sweatCool),
      sweat_rate_lph_hot: toFloatOrNull(sweatHot),
      sodium_loss_mg_per_l: toIntOrNull(sodiumLoss),
      heat_acclimated: heatAcclimated,
      caffeine_sensitivity: caffeineSensitivity || null,
      gi_tolerance_score: toIntOrNull(giTolerance),
      best_10k_time: best10k || null,
      best_half_time: bestHalf || null,
      best_marathon_time: bestMarathon || null,
    };

    const { error } = await supabase.from("profiles").upsert(payload, {
      onConflict: "id",
    });

    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Profil enregistré ✅");
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <form onSubmit={onSave} className="grid gap-8">
      {/* ========= MVP — Profil athlète ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Profil athlète — MVP (obligatoire)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Sexe</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
              required
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
              required
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
              required
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
              required
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Objectifs (course cible, date, etc.)</span>
          <textarea
            className="border rounded-lg px-3 py-2"
            rows={3}
            value={objectifs}
            onChange={(e) => setObjectifs(e.target.value)}
            placeholder="Ex : SaintéLyon 2025 en 12h, préparation été, etc."
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
      </section>

      {/* ========= MVP — Contraintes alimentaires ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Contraintes alimentaires — MVP</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Régime</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
            >
              {DIET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">Allergènes / intolérances (CSV)</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={allergensText}
              onChange={(e) => setAllergensText(e.target.value)}
              placeholder="ex. gluten, lactose, nuts"
            />
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={consentData}
              onChange={(e) => setConsentData(e.target.checked)}
            />
            <span className="text-sm">J’accepte l’utilisation de mes données (RGPD)</span>
          </label>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border px-4 py-2 ml-auto"
          >
            Se déconnecter
          </button>
        </div>
      </section>

      {/* ========= V1 / V2 — Physiologie & performances ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Physiologie & performances — V1/V2</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Taux de sudation (L/h) – frais</span>
            <input
              type="number"
              min={0}
              step="0.01"
              className="border rounded-lg px-3 py-2"
              value={sweatCool}
              onChange={(e) => setSweatCool(e.target.value)}
              placeholder="ex. 0.6"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Taux de sudation (L/h) – chaud</span>
            <input
              type="number"
              min={0}
              step="0.01"
              className="border rounded-lg px-3 py-2"
              value={sweatHot}
              onChange={(e) => setSweatHot(e.target.value)}
              placeholder="ex. 1.0"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Perte sodée (mg/L)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={sodiumLoss}
              onChange={(e) => setSodiumLoss(e.target.value)}
              placeholder="ex. 700"
            />
          </label>
          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={heatAcclimated}
              onChange={(e) => setHeatAcclimated(e.target.checked)}
            />
            <span className="text-sm">Acclimaté à la chaleur</span>
          </label>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Sensibilité caféine</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={caffeineSensitivity}
              onChange={(e) => setCaffeineSensitivity(e.target.value)}
            >
              <option value="">—</option>
              {CAFFEINE_SENSITIVITY.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Tolérance digestive (1–5)</span>
            <input
              type="number"
              min={1}
              max={5}
              className="border rounded-lg px-3 py-2"
              value={giTolerance}
              onChange={(e) => setGiTolerance(e.target.value)}
              placeholder="ex. 4"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">10 km (hh:mm:ss)</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={best10k}
              onChange={(e) => setBest10k(e.target.value)}
              placeholder="ex. 00:45:30"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Semi (hh:mm:ss)</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={bestHalf}
              onChange={(e) => setBestHalf(e.target.value)}
              placeholder="ex. 01:38:00"
            />
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">Marathon (hh:mm:ss)</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={bestMarathon}
              onChange={(e) => setBestMarathon(e.target.value)}
              placeholder="ex. 03:45:00"
            />
          </label>
        </div>
      </section>

      {/* CTA */}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        {msg && <p className="text-green-700 text-sm">{msg}</p>}
      </div>
    </form>
  );
}
