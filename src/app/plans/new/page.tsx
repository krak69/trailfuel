export const metadata = {
  title: "Nouveau plan | TrailFuel",
};

export default function NewPlanPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Créer un nouveau plan</h1>
      <p className="opacity-80 mb-6">
        Importe ton GPX et renseigne les infos de course. Nous générerons ton plan
        d’ingestion (glucides, hydratation, sodium, caféine) avec waypoints et inventaire.
      </p>

      {/* Placeholder: tu brancheras ici ton wizard/flow */}
      <div className="grid gap-4 border rounded-xl p-6">
        <p className="text-sm opacity-80">
          Prochaines étapes (à implémenter) :
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Étape 1 — Import du fichier GPX</li>
          <li>Étape 2 — Paramètres de la course (heure départ, météo, ravitos, etc.)</li>
          <li>Étape 3 — Validation & génération du plan</li>
        </ul>

        <div className="pt-2">
          <button
            className="rounded-lg bg-black text-white px-4 py-2"
            // onClick={...} // à brancher vers ton composant d’upload / wizard
          >
            Démarrer
          </button>
        </div>
      </div>
    </div>
  );
}
