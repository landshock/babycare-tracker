# BabyCare Tracker - Supabase version

PWA til tracking af amning, brystpumpet mælk, modermælkserstatning og søvn.
Denne version bruger Supabase til login og synkronisering mellem enheder.

## 1. Opret Supabase projekt

Opret et nyt projekt i Supabase.

Hent derefter:
- Project URL
- Publishable key

Supabase anbefaler at bruge browser-klienten med en publishable/anon key og beskytte data med Row Level Security (RLS). RLS skal være aktiveret på tabeller i eksponeret schema. citeturn605236search1turn605236search15turn605236search16

## 2. Opret database-tabellen

Kør SQL'en i `supabase/schema.sql` i Supabase SQL Editor.

Det opretter:
- `entries` tabel
- RLS policies så hver bruger kun ser egne data
- trigger til `updated_at`

## 3. Sæt miljøvariabler

Kopiér `.env.example` til `.env` og udfyld:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

Supabase React quickstart bruger Vite-miljøvariabler på denne form. citeturn605236search15turn605236search18

## 4. Lokal kørsel

```bash
npm install
npm run dev
```

## 5. Deploy

Vercel eller Netlify:
- Build command: `npm run build`
- Output folder: `dist`

Tilføj de samme miljøvariabler i hosting-platformens settings.

## 6. Login-flow

Appen bruger email + password:
- Opret konto
- Log ind
- Log ud

Supabase understøtter både password login og passwordless email flows. Denne app er sat op med email + password for enkelhed. citeturn605236search2turn605236search4turn605236search6turn605236search13

## 7. Deling mellem forældre

Den hurtigste model er at bruge samme login på begge telefoner.

Hvis du senere vil have separate konti til hver forælder, kan næste version udvides med en `families` tabel og invitationer.

## PWA

Projektet er fortsat installérbart som PWA med:
- `manifest.webmanifest`
- `sw.js`
- startskærms-installation

## Sikkerhed

- Brug kun publishable/anon key i frontend.
- Brug aldrig service role key i frontend, da den omgår RLS. citeturn605236search16
