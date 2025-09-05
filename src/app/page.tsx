import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero full-bleed */}
      <section className="section-bleed bg-white/70">
        <div className="section-inner text-center py-14 md:py-24">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">TrailFuel</h1>
          <p className="text-lg md:text-2xl opacity-80 mb-8">
            Ton plan nutrition, tracé pour performer
          </p>
          <Link href="/routes/new" className="btn bg-emerald-600 text-white px-6 py-3 rounded-xl text-lg">
            Importer un GPX
          </Link>
        </div>
      </section>

      {/* Description + bullets, sur largeur 1440px */}
      <section className="container-wide space-y-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Pourquoi TrailFuel ?</h2>
          <p className="opacity-80">
            TrailFuel planifie ta nutrition et ton hydratation selon ton profil, ton parcours et la météo.
            Importe ton GPX et génère un plan complet en quelques secondes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 text-center">
            <h3 className="font-semibold mb-2">⚡ Simple</h3>
            <p className="text-sm opacity-80">Un plan en moins de 2 minutes.</p>
          </div>
          <div className="card p-6 text-center">
            <h3 className="font-semibold mb-2">📊 Précis</h3>
            <p className="text-sm opacity-80">Ingestions minute par minute adaptées.</p>
          </div>
          <div className="card p-6 text-center">
            <h3 className="font-semibold mb-2">🗂️ Actionnable</h3>
            <p className="text-sm opacity-80">Exports GPX/CSV/PDF + inventaire.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
