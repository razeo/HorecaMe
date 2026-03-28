# HorecaMe — Setup Guide

## Korak 1: Kreiraj Supabase nalog i projekt

1. Otvori browser i idi na **https://supabase.com**
2. Klikni **"Start your project"** → registruj se (GitHub nalog je najbrže)
3. Nakon registracije, klikni **"New Project"**
4. Ispuni:
   - **Name**: `horecame`
   - **Database Password**: zapamti ovu lozinku! (npr. `HorecameDB2026!`)
   - **Region**: `West EU (Frankfurt)` (najbliži Crnoj Gori)
   - **Pricing Plan**: Free (za početak je dovoljno)
5. Klikni **"Create new project"** i sačekaj 1-2 minuta da se kreira

---

## Korak 2: Uzmi Supabase ključeve

Kada se projekt kreira:

1. U lijevom meniju klikni **Settings** (zupčanik ⚙️)
2. Klikni **API** u podmeniju
3. Vidjećeš tri bitne stvari — **zapiši ih**:

```
Project URL:    https://xxxxxxxxxxxxxxxx.supabase.co
anon public:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ `service_role` ključ je TAJNA — nikad ga ne dijeli javno!

---

## Korak 3: Postavi environment varijable

Otvori terminal i pokreni:

```bash
cd ~/HorecaMe/apps/web
```

Otvori fajl `.env.local` u editoru:

```bash
nano .env.local
```

Zamijeni postojeći sadržaj sa svojim ključevima:

```
NEXT_PUBLIC_SUPABASE_URL=https://TVOJ-PROJECT-ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tvój-anon-key-ovdje
SUPABASE_SERVICE_ROLE_KEY=tvój-service-role-key-ovdje
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Sačuvaj: `Ctrl+O` → `Enter` → `Ctrl+X`

---

## Korak 4: Pokreni SQL migracije (kreiranje tablica)

1. Idi na Supabase dashboard → lijevi meniju → **SQL Editor**
2. Klikni **"New query"**
3. Otvori fajl sa šemom na svom kompjuteru:

```bash
cat ~/HorecaMe/packages/db/supabase/migrations/001_initial_schema.sql
```

4. **Kopiraj SAV sadržaj** tog fajla
5. **Zalijepi** u SQL Editor na Supabase
6. Klikni **"Run"** (ili `Ctrl+Enter`)
7. Treba da vidiš **"Success. No rows returned"** — to je OK!

> Ako dobiješ grešku "extension pg_trgm does not exist", prvo pokreni:
> ```sql
> CREATE EXTENSION IF NOT EXISTS "pg_trgm";
> ```
> pa zatim ponovo pokreni ostatak.

---

## Korak 5: Unesi seed podatke (testni podaci)

1. U istom SQL Editor-u, klikni **"New query"**
2. Otvori seed fajl:

```bash
cat ~/HorecaMe/packages/db/supabase/seed.sql
```

3. Kopiraj sav sadržaj → Zalijepi u SQL Editor → Klikni **"Run"**
4. Treba da vidiš uspješno izvršenje

---

## Korak 6: Provjeri da su tablice kreirane

U Supabase dashboard-u:
1. Klikni **Table Editor** u lijevom meniju
2. Treba da vidiš ove tablice:
   - `companies`
   - `profiles`
   - `categories`
   - `category_translations`
   - `products`
   - `product_translations`
   - `product_variants`
   - `tiered_pricing`
   - `tax_rules`
   - `inquiry_baskets`
   - `inquiry_items`
   - `supplier_rfqs`
   - `rfq_items`
   - `posts`
   - `post_translations`

Ako ih vidiš — baza je spremna! 🎉

---

## Korak 7: Pokreni development server

Vrati se u terminal:

```bash
cd ~/HorecaMe
pnpm dev
```

Sačekaj dok vidiš:
```
▲ Next.js 15.x.x
- Local: http://localhost:3000
```

---

## Korak 8: Otvori aplikaciju u browseru

1. Otvori **http://localhost:3000**
2. Automatski će te preusmjeriti na `/me` (crnogorski jezik)
3. Treba da vidiš HorecaMe homepage sa:
   - Hero sekcijom
   - Kategorijama (Hrana, Pića, Oprema...)
   - Navigacijom

---

## Korak 9: Testiraj registraciju

1. Klikni **"Registrujte se"** (ili idi na `/me/auth/sign-up`)
2. Ispuni formu:
   - **Puno ime**: Marko Marković
   - **Naziv kompanije**: Test Hotel d.o.o.
   - **Tip kompanije**: Kupac
   - **Email**: `test@example.com`
   - **Lozinka**: `test123456`
3. Klikni **"Registrujte se"**

> ⚠️ Supabase šalje email za potvrdu. U development-u, možeš ovo isključiti:
> Idi na Supabase → **Settings** → **Authentication** → **Email** → isključi **"Enable email confirmations"**

---

## Korak 10: Pregledaj proizvode

1. Idi na `/me/products`
2. Treba da vidiš testne proizvode iz seed-a:
   - Ekstradjevičansko maslinovo ulje 5L (MonteFood)
   - Pileći file 10kg (MonteFood)
   - Vranac Pro Corde 0.75L (Adriatic Drinks)
   - Nikšićko pivo 0.5L (Adriatic Drinks)
   - Konvektomat Rational (GastroTech CG)
   - ...itd.

---

## Troubleshooting

| Problem | Rješenje |
|---------|----------|
| `pnpm: command not found` | Pokreni: `export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"` |
| Port 3000 zauzet | Pokreni: `pnpm dev --port 3001` |
| Greška "Missing Supabase env vars" | Provjeri `.env.local` — ključevi moraju biti tačni |
| Prazna stranica bez podataka | Provjeri da si pokrenuo seed.sql |
| Auth ne radi | Isključi email confirmation u Supabase Settings |
| `Module not found` greška | Pokreni: `pnpm install` iz root foldera |
| TypeScript greške | Pokreni: `pnpm typecheck` da vidiš detalje |

---

## Korisne URL-ove

| Stranica | URL |
|----------|-----|
| Homepage (ME) | http://localhost:3000/me |
| Homepage (EN) | http://localhost:3000/en |
| Proizvodi | http://localhost:3000/me/products |
| Kategorije | http://localhost:3000/me/categories |
| Dobavljači | http://localhost:3000/me/suppliers |
| Prijava | http://localhost:3000/me/auth/sign-in |
| Registracija | http://localhost:3000/me/auth/sign-up |
| Korpa | http://localhost:3000/me/basket |
| Dashboard | http://localhost:3000/me/dashboard |
| Supabase Dashboard | https://supabase.com/dashboard |

---

## Šta dalje?

Kad sve radi, možeš:
- Dodati sopstvene proizvode kroz SQL Editor ili kroz dashboard
- Kreirati drugog korisnika kao **"Dobavljača"** i testirati RFQ flow
- Koristiti `⌘K` (Mac) ili `Ctrl+K` (Windows/Linux) za brzu pretragu
- Promijeniti jezik na `/en/...` za engleski
- Pregledaj fajl `packages/db/supabase/migrations/001_initial_schema.sql` za kompletnu šemu baze
