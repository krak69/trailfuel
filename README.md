# TrailFuel — Starter minimal (Next.js 14 + App Router + Tailwind + Supabase client)

## Démarrage

1. Installer les dépendances
```bash
npm install
```

2. Copier l'exemple d'env
```bash
cp .env.example .env.local
```

3. Dev
```bash
npm run dev
```

4. Build
```bash
npm run build && npm start
```

## Notes
- Home `/` publique.
- `/auth/login` et `/auth/reset` publics.
- Pas de middleware inclus par défaut pour éviter les 404. Ajoutez-en un plus tard si vous souhaitez protéger certaines sections.
- `src/lib/supabaseClient.ts` est prêt pour usage côté client avec `NEXT_PUBLIC_*`.
