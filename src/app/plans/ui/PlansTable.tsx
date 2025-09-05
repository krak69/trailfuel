// src/app/plans/ui/PlansTable.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Plan = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string | null;
  title: string | null;
  plan_type: "course" | "long_run" | "test" | "workout" | "hike" | "other";
  start_at: string | null;
  distance_km: number | null;
  elevation_gain_m: number | null;
  status: "planned" | "past" | "draft" | "cancelled";
  success_score: number | null;
  route_name: string | null;
  route_gpx_url: string | null;
  duration_expected_min: number | null;
  notes: string | null;
};

const TYPE_LABEL: Record<Plan["plan_type"], string> = {
  course: "Course",
  long_run: "Sortie longue",
  test: "Test",
  workout: "Séance",
  hike: "Rando",
  other: "Autre",
};

const STATUS_LABEL: Record<Plan["status"], string> = {
  planned: "Prévue",
  past: "Passée",
  draft: "Brouillon",
  cancelled: "Annulée",
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return d;
  }
}

function fmtKm(n: number | null | undefined) {
  if (n == null) return "—";
  return `${Number(n).toFixed(1)} km`;
}

function fmtDPlus(n: number | null | undefined) {
  if (n == null) return "—";
  return `${n} m`;
}

function scoreCell(n: number | null | undefined) {
  if (n == null) return "—";
  return `${n}%`;
}

export default function PlansTable({ initialPlans }: { initialPlans: Plan[] }) {
  const supabase = React.useMemo(createClient, []);
  const [plans, setPlans] = React.useState<Plan[]>(initialPlans);
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<"" | Plan["status"]>("");

  const filtered = React.useMemo(() => {
    const qs = q.trim().toLowerCase();
    return plans.filter((p) => {
      const matchesQ =
        !qs ||
        `${p.title ?? ""} ${p.route_name ?? ""} ${TYPE_LABEL[p.plan_type]}`
          .toLowerCase()
          .includes(qs);
      const matchesStatus = !status || p.status === status;
      return matchesQ && matchesStatus;
    });
  }, [plans, q, status]);

  async function handleDelete(id: string) {
    const ok = confirm("Supprimer ce plan ? Cette action est définitive.");
    if (!ok) return;
    const prev = plans;
    setPlans((cur) => cur.filter((p) => p.id !== id));
    const { error } = await supabase.from("plans").delete().eq("id", id);
    if (error) {
      alert(error.message);
      setPlans(prev); // rollback
    }
  }

  return (
    <div className="grid gap-4">
      {/* Barre outils */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          className="w-full max-w-xs rounded-lg border px-3 py-2"
          placeholder="Rechercher un plan…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-lg border px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="">Tous les statuts</option>
          <option value="planned">Prévue</option>
          <option value="past">Passée</option>
          <option value="draft">Brouillon</option>
          <option value="cancelled">Annulée</option>
        </select>

        <div className="ml-auto">
          <Link
            href="/plans/new"
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Nouveau plan
          </Link>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-black/5 text-left">
            <tr>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Titre / Évènement</th>
              <th className="px-3 py-2">Km</th>
              <th className="px-3 py-2">D+</th>
              <th className="px-3 py-2">Statut</th>
              <th className="px-3 py-2">Score</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center opacity-70">
                  Aucun plan pour le moment.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2 align-top">{fmtDate(p.start_at)}</td>
                  <td className="px-3 py-2 align-top">
                    <span className="rounded bg-black/5 px-2 py-1">
                      {TYPE_LABEL[p.plan_type]}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="font-medium">
                      {p.title ?? p.route_name ?? "—"}
                    </div>
                    {(p.title && p.route_name && p.route_name !== p.title) && (
                      <div className="text-xs opacity-70">{p.route_name}</div>
                    )}
                  </td>
                  <td className="px-3 py-2 align-top">{fmtKm(p.distance_km)}</td>
                  <td className="px-3 py-2 align-top">{fmtDPlus(p.elevation_gain_m)}</td>
                  <td className="px-3 py-2 align-top">
                    <span
                      className={[
                        "rounded px-2 py-1",
                        p.status === "planned" && "bg-blue-50 text-blue-700",
                        p.status === "past" && "bg-green-50 text-green-700",
                        p.status === "draft" && "bg-amber-50 text-amber-700",
                        p.status === "cancelled" && "bg-red-50 text-red-700",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {STATUS_LABEL[p.status]}
                    </span>
                  </td>
                  <td className="px-3 py-2 align-top">{scoreCell(p.success_score)}</td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/plans/${p.id}`}
                        className="rounded border px-2 py-1"
                        title="Éditer"
                      >
                        Éditer
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded border px-2 py-1"
                        title="Supprimer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
