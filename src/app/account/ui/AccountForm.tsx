"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;

  // Déjà existants
  sex?: "male" | "female" | "other" | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  age_years?: number | null;
  objectifs?: string | null;
  allure_base?: string | null;

  // MVP
  carbs_target_gph_min?: number | null;
  carbs_target_gph_max?: number | null;
  fuel_forms?: string[] | null; // ['Gel','Purée','Boisson effort','Barre','Autre']
  flavor_avoid?: string[] | null;
  fluid_target_mlph?: number | null;
  sodium_target_mgph?: number | null;
  auto_estimate_hydration?: boolean | null;
  caffeine_ok?: boolean | null;
  caffeine_cap_mg_race?: number | null;
  diet_type?: string | null;
  allergens?: string[] | null;
  flask_ml?: number | null;
  flask_count?: number | null;
  bladder_ml?: number | null;
  vest_capacity_l?: number | null;
  aid_strategy?: string | null; // 'water_only' | 'isotonic' | 'custom_mix'
  units?: string | null;        // 'metric' | 'imperial'
  locale?: string | null;       // 'fr-FR' | 'en-US'
  consent_data?: boolean | null;

  // V1
  sweat_rate_lph_cool?: number | null;
  sweat_rate_lph_hot?: number | null;
  sodium_loss_mg_per_l?: number | null;
  heat_acclimated?: boolean | null;
  caffeine_sensitivity?: string | null; // 'low'|'medium'|'high'
  gi_tolerance_score?: number | null;   // 1..5
  best_10k_time?: string | null;        // texte '00:45:30'
  best_half_time?: string | null;
  best_marathon_time?: string | null;
  uses_poles?: boolean | null;
  dropbag_ok?: boolean | null;
} | null;

const FUEL_FORM_OPTIONS = ["gel", "drink_mix", "bar", "real_food"] as const;
const DIET_OPTIONS = ["omnivore", "vegetarian", "vegan", "other"] as const;
const AID_STRATEGY_OPTIONS = ["water_only", "isotonic", "custom_mix"] as const;
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
function toggleInArray(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
}

export default function AccountForm({
  userId,
  initialProfile,
}: {
  userId: string;
  initialProfile: Profile;
}) {
  const supabase = React.useMemo(createClient, []);

  // ===========
  // Déjà là
  // ===========
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

  // ===========
  // MVP
  // ===========
  const [carbsMin, setCarbsMin] = React.useState<string>(
    initialProfile?.carbs_target_gph_min != null
      ? String(initialProfile.carbs_target_gph_min)
      : ""
  );
  const [carbsMax, setCarbsMax] = React.useState<string>(
    initialProfile?.carbs_target_gph_max != null
      ? String(initialProfile.carbs_target_gph_max)
      : ""
  );
  const [fuelForms, setFuelForms] = React.useState<string[]>(
    initialProfile?.fuel_forms ?? []
  );
  const [flavorAvoidText, setFlavorAvoidText] = React.useState<string>(
    joinCSV(initialProfile?.flavor_avoid)
  );
  const [fluidTarget, setFluidTarget] = React.useState<string>(
    initialProfile?.fluid_target_mlph != null
      ? String(initialProfile.fluid_target_mlph)
      : ""
  );
  const [sodiumTarget, setSodiumTarget] = React.useState<string>(
    initialProfile?.sodium_target_mgph != null
      ? String(initialProfile.sodium_target_mgph)
      : ""
  );
  const [autoEstimateHydration, setAutoEstimateHydration] = React.useState<boolean>(
    initialProfile?.auto_estimate_hydration ?? true
  );
  const [caffeineOk, setCaffeineOk] = React.useState<boolean>(
    initialProfile?.caffeine_ok ?? true
  );
  const [caffeineCap, setCaffeineCap] = React.useState<string>(
    initialProfile?.caffeine_cap_mg_race != null
      ? String(initialProfile.caffeine_cap_mg_race)
      : ""
  );
  const [dietType, setDietType] = React.useState<string>(
    initialProfile?.diet_type ?? "omnivore"
  );
  const [allergensText, setAllergensText] = React.useState<string>(
    joinCSV(initialProfile?.allergens)
  );
  const [flaskMl, setFlaskMl] = React.useState<string>(
    initialProfile?.flask_ml != null ? String(initialProfile.flask_ml) : ""
  );
  const [flaskCount, setFlaskCount] = React.useState<string>(
    initialProfile?.flask_count != null ? String(initialProfile.flask_count) : ""
  );
  const [bladderMl, setBladderMl] = React.useState<string>(
    initialProfile?.bladder_ml != null ? String(initialProfile.bladder_ml) : ""
  );
  const [vestCapacity, setVestCapacity] = React.useState<string>(
    initialProfile?.vest_capacity_l != null
      ? String(initialProfile.vest_capacity_l)
      : ""
  );
  const [aidStrategy, setAidStrategy] = React.useState<string>(
    initialProfile?.aid_strategy ?? "water_only"
  );
  const [units, setUnits] = React.useState<string>(initialProfile?.units ?? "metric");
  const [locale, setLocale] = React.useState<string>(
    initialProfile?.locale ?? "fr-FR"
  );
  const [consentData, setConsentData] = React.useState<boolean>(
    initialProfile?.consent_data ?? false
  );

  // ===========
  // V1
  // ===========
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
  const [usesPoles, setUsesPoles] = React.useState<boolean>(
    initialProfile?.uses_poles ?? false
  );
  const [dropbagOk, setDropbagOk] = React.useState<boolean>(
    initialProfile?.dropbag_ok ?? false
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

      // Déjà là
      sex: (sex || null) as "male" | "female" | "other" | null,
      weight_kg: toFloatOrNull(weight),
      height_cm: toFloatOrNull(height),
      age_years: toIntOrNull(age),
      objectifs: objectifs || null,
      allure_base: allure || null,

      // MVP
      carbs_target_gph_min: toIntOrNull(carbsMin),
      carbs_target_gph_max: toIntOrNull(carbsMax),
      fuel_forms: fuelForms.length ? fuelForms : null,
      flavor_avoid: parseCSV(flavorAvoidText),
      fluid_target_mlph: toIntOrNull(fluidTarget),
      sodium_target_mgph: toIntOrNull(sodiumTarget),
      auto_estimate_hydration: autoEstimateHydration,
      caffeine_ok: caffeineOk,
      caffeine_cap_mg_race: toIntOrNull(caffeineCap),
      diet_type: dietType || null,
      allergens: parseCSV(allergensText),
      flask_ml: toIntOrNull(flaskMl),
      flask_count: toIntOrNull(flaskCount),
      bladder_ml: toIntOrNull(bladderMl),
      vest_capacity_l: toIntOrNull(vestCapacity),
      aid_strategy: aidStrategy || null,
      units: units || "metric",
      locale: locale || "fr-FR",
      consent_data: consentData,

      // V1
      sweat_rate_lph_cool: toFloatOrNull(sweatCool),
      sweat_rate_lph_hot: toFloatOrNull(sweatHot),
      sodium_loss_mg_per_l: toIntOrNull(sodiumLoss),
      heat_acclimated: heatAcclimated,
      caffeine_sensitivity: caffeineSensitivity || null,
      gi_tolerance_score: toIntOrNull(giTolerance),
      best_10k_time: best10k || null,
      best_half_time: bestHalf || null,
      best_marathon_time: bestMarathon || null,
      uses_poles: usesPoles,
      dropbag_ok: dropbagOk,
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
      {/* ========= Profil athlète (existant) ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Profil athlète (MVP)</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Sexe</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={sex}
              onChange={(e) => setSex(e.target.value as any)}
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

      {/* ========= Préférences nutrition (MVP) ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Préférences nutrition (MVP)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Glucides cibles min (g/h)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={carbsMin}
              onChange={(e) => setCarbsMin(e.target.value)}
              placeholder="ex. 50"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Glucides cibles max (g/h)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={carbsMax}
              onChange={(e) => setCarbsMax(e.target.value)}
              placeholder="ex. 80"
            />
          </label>

          <div className="grid gap-1">
            <span className="text-sm">Formes préférées</span>
            <div className="flex flex-wrap gap-3 border rounded-lg px-3 py-2">
              {FUEL_FORM_OPTIONS.map((opt) => (
                <label key={opt} className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={fuelForms.includes(opt)}
                    onChange={() => setFuelForms((prev) => toggleInArray(prev, opt))}
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">Saveurs à éviter (séparées par des virgules)</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={flavorAvoidText}
              onChange={(e) => setFlavorAvoidText(e.target.value)}
              placeholder="ex. citron, fruits rouges, cola"
            />
          </label>
        </div>
      </section>

      {/* ========= Hydratation & Sodium (MVP) ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Hydratation & Sodium (MVP)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Hydratation cible (ml/h)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={fluidTarget}
              onChange={(e) => setFluidTarget(e.target.value)}
              placeholder="ex. 500"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Sodium cible (mg/h)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={sodiumTarget}
              onChange={(e) => setSodiumTarget(e.target.value)}
              placeholder="ex. 600"
            />
          </label>

          <label className="inline-flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={autoEstimateHydration}
              onChange={(e) => setAutoEstimateHydration(e.target.checked)}
            />
            <span className="text-sm">Estimer automatiquement selon météo/profil</span>
          </label>
        </div>
      </section>

      {/* ========= Caféine (MVP) ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Caféine (MVP)</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={caffeineOk}
              onChange={(e) => setCaffeineOk(e.target.checked)}
            />
            <span className="text-sm">Autoriser la caféine</span>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-sm">Plafond caféine course (mg)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={caffeineCap}
              onChange={(e) => setCaffeineCap(e.target.value)}
              placeholder="ex. 300"
            />
          </label>
        </div>
      </section>

      {/* ========= Contraintes alimentaires (MVP) ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Contraintes alimentaires (MVP)</h2>
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
            <span className="text-sm">Allergènes/intolérances (CSV)</span>
            <input
              className="border rounded-lg px-3 py-2"
              value={allergensText}
              onChange={(e) => setAllergensText(e.target.value)}
              placeholder="ex. gluten, lactose, nuts"
            />
          </label>
        </div>
      </section>

      {/* ========= Équipement & logistique (MVP) ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Équipement & logistique (MVP)</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Flasque (ml)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={flaskMl}
              onChange={(e) => setFlaskMl(e.target.value)}
              placeholder="ex. 500"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Nb flasques</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={flaskCount}
              onChange={(e) => setFlaskCount(e.target.value)}
              placeholder="ex. 2"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Poche à eau (ml)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={bladderMl}
              onChange={(e) => setBladderMl(e.target.value)}
              placeholder="ex. 1500"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Capacité gilet (L)</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg px-3 py-2"
              value={vestCapacity}
              onChange={(e) => setVestCapacity(e.target.value)}
              placeholder="ex. 10"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Stratégie ravito</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={aidStrategy}
              onChange={(e) => setAidStrategy(e.target.value)}
            >
              {AID_STRATEGY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Unités</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
            >
              <option value="metric">metric</option>
              <option value="imperial">imperial</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Langue</span>
            <select
              className="border rounded-lg px-3 py-2"
              value={locale}
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="fr-FR">fr-FR</option>
              <option value="en-US">en-US</option>
            </select>
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

      {/* ========= V1 : physiologie & perfs ========= */}
      <section className="grid gap-4">
        <h2 className="text-lg font-semibold">Physiologie & performances (V1)</h2>
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

        <div className="grid md:grid-cols-2 gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={usesPoles}
              onChange={(e) => setUsesPoles(e.target.checked)}
            />
            <span className="text-sm">J’utilise des bâtons</span>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={dropbagOk}
              onChange={(e) => setDropbagOk(e.target.checked)}
            />
            <span className="text-sm">Drop-bag prévu</span>
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
