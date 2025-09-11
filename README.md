# TrailFuel (MVP complet S1→S4)

MVP Next.js + Supabase
- GPX upload
- Carte MapLibre + profil topo Recharts (sync)
- Calcul automatique des waypoints (glucides/h, ml/h, sodium/h, ravitos, durée cible)
- Catalogue produits + stock
- Sélection par waypoint (réservation de stock)
- Exports CSV + PDF
- Triggers SQL pour stock

## Déploiement

### 1) Crée ton projet Supabase
- Project URL + anon key (public)
- Service role key (private)
- Dans **SQL Editor**, exécute `supabase/migrations/000_init.sql`

### 2) Variables d'environnement (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL` = https://....supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = xxx
- `SUPABASE_SERVICE_ROLE_KEY` = xxx (server-side only)
- `MAPTILER_KEY` (optionnel si tu veux un style maptile)

### 3) Local
```bash
npm i
npm run dev
```

### 4) Vercel
- Importer repo Github → Variables → Deploy

## Notions
- RLS active (politiques basiques dans SQL)
- Les décréments/incréments de stock sont gérés via triggers sur `plan_products`
- L'API `/api/plans` utilise la service key pour transactions serveurs

## Structure
- `src/components/*` : Map, Profil, Pickers
- `src/app/plans/*` : liste, création, vue
- `src/app/api/*` : routes server (CRUD plans, export CSV)
- `src/lib/*` : parse GPX, supabase clients, helpers

> Attention : pour la carte, ajoute une clé de style ou utilise le style par défaut (libre) si disponible.
