# 🔧 Konfiguracja CosmoFlow by ARCĀNUM

## 📋 Spis treści

1. [Wymagania systemowe](#wymagania-systemowe)
2. [Konfiguracja bazy danych Supabase](#konfiguracja-bazy-danych-supabase)
3. [Zmienne środowiskowe](#zmienne-środowiskowe)
4. [Konfiguracja uwierzytelniania](#konfiguracja-uwierzytelniania)
5. [Migracje bazy danych](#migracje-bazy-danych)
6. [Konfiguracja lokalna](#konfiguracja-lokalna)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## 🖥️ Wymagania systemowe

- **Node.js:** v18.0.0 lub nowszy
- **npm:** v8.0.0 lub nowszy
- **Git:** najnowsza wersja
- **Konto Supabase:** darmowe lub płatne

## 🗄️ Konfiguracja bazy danych Supabase

### 1. Utworzenie projektu Supabase

1. Przejdź na [supabase.com](https://supabase.com)
2. Zaloguj się lub utwórz nowe konto
3. Kliknij "New Project"
4. Wypełnij dane:
   - **Name:** `cosmic-echoes-guide`
   - **Database Password:** Wygeneruj silne hasło (zapisz je!)
   - **Region:** Wybierz najbliższy region
5. Kliknij "Create new project"

### 2. Pobranie kluczy API

Po utworzeniu projektu:

1. Przejdź do **Settings** → **API**
2. Skopiuj następujące wartości:
   - **Project URL:** `https://[your-project-id].supabase.co`
   - **anon public key:** `eyJ...` (długi token JWT)
   - **service_role key:** `eyJ...` (długi token JWT - **NIGDY nie używaj w frontend!**)

### 3. Konfiguracja uwierzytelniania

1. Przejdź do **Authentication** → **Settings**
2. W sekcji **Site URL** dodaj:
   - Development: `http://localhost:8083`
   - Production: `https://your-domain.com`
3. W sekcji **Redirect URLs** dodaj:
   - `http://localhost:8083/**`
   - `https://your-domain.com/**`

### 4. Konfiguracja Row Level Security (RLS)

Supabase automatycznie włącza RLS. Nasze migracje zawierają odpowiednie polityki bezpieczeństwa.

## 🔐 Zmienne środowiskowe

### Plik `.env.local` (Development)

Utwórz plik `.env.local` w katalogu głównym projektu:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ[your-anon-key]

# Optional: Google APIs (dla geolokalizacji)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Development
VITE_APP_ENV=development
VITE_APP_VERSION=1.0.0
```

### Plik `.env.production` (Production)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://[your-project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ[your-anon-key]

# Google APIs
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Production
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### ⚠️ Bezpieczeństwo zmiennych

- **NIGDY** nie commituj plików `.env*` do repozytorium
- **NIGDY** nie używaj `service_role` key w frontend
- Używaj tylko `anon` key w aplikacji React
- Wszystkie zmienne z prefiksem `VITE_` są publiczne

## 🔑 Konfiguracja uwierzytelniania

### Obsługiwane metody logowania

1. **Email/Password** - domyślnie włączone
2. **Magic Links** - logowanie przez email bez hasła
3. **OAuth Providers** (opcjonalnie):
   - Google
   - GitHub
   - Discord

### Konfiguracja OAuth (opcjonalnie)

#### Google OAuth:
1. Przejdź do [Google Cloud Console](https://console.cloud.google.com)
2. Utwórz nowy projekt lub wybierz istniejący
3. Włącz Google+ API
4. Utwórz OAuth 2.0 credentials
5. Dodaj authorized redirect URIs:
   - `https://[your-project-id].supabase.co/auth/v1/callback`
6. W Supabase: **Authentication** → **Providers** → **Google**
7. Wprowadź Client ID i Client Secret

## 🗃️ Migracje bazy danych

### Automatyczne uruchomienie migracji

Migracje są automatycznie stosowane przez Supabase. Nasze migracje znajdują się w:

```
supabase/migrations/
├── 20250730182929_460570ec-2a3c-4057-b718-c06bd8066ac3.sql
├── 20250730182949_dcb108c8-1bd3-4e9f-90c4-9086391ac2aa.sql
└── 20250730190400_add_public_profiles.sql
```

### Struktura bazy danych

#### Tabela `profiles`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- name (text)
- birth_date (date)
- birth_time (time)
- birth_place (text)
- profile_data (jsonb) -- wszystkie analizy
- is_public (boolean, default false)
- view_count (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

#### Tabela `profile_views`
```sql
- id (uuid, primary key)
- profile_id (uuid, foreign key)
- viewed_at (timestamp)
- referrer_source (text, nullable)
- ip_address (inet, nullable)
```

### Polityki RLS

```sql
-- Użytkownicy mogą czytać swoje profile
CREATE POLICY "Users can read own profiles" ON profiles
FOR SELECT USING (auth.uid() = user_id);

-- Użytkownicy mogą aktualizować swoje profile
CREATE POLICY "Users can update own profiles" ON profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Wszyscy mogą czytać publiczne profile
CREATE POLICY "Anyone can read public profiles" ON profiles
FOR SELECT USING (is_public = true);
```

## 💻 Konfiguracja lokalna

### 1. Klonowanie repozytorium

```bash
git clone https://github.com/nmatjar/cosmic-echoes-guide.git
cd cosmic-echoes-guide
```

### 2. Instalacja zależności

```bash
npm install
```

### 3. Konfiguracja zmiennych środowiskowych

```bash
cp .env.example .env.local
# Edytuj .env.local z właściwymi wartościami
```

### 4. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod: `http://localhost:8083`

### 5. Testowanie połączenia z bazą danych

Po uruchomieniu aplikacji:
1. Otwórz Developer Tools (F12)
2. Przejdź do zakładki Console
3. Sprawdź czy nie ma błędów połączenia z Supabase
4. Spróbuj utworzyć profil - powinien zostać zapisany w bazie

## 🚀 Deployment

### Vercel (Zalecane)

1. **Połącz repozytorium:**
   - Zaloguj się na [vercel.com](https://vercel.com)
   - Kliknij "New Project"
   - Importuj repozytorium z GitHub

2. **Konfiguracja zmiennych środowiskowych:**
   - W ustawieniach projektu dodaj wszystkie zmienne z `.env.production`
   - Upewnij się, że używasz prefiksu `VITE_`

3. **Deploy:**
   - Vercel automatycznie zbuduje i wdroży aplikację
   - Każdy push do `main` branch uruchomi nowy deployment

### Netlify

1. **Połącz repozytorium:**
   - Zaloguj się na [netlify.com](https://netlify.com)
   - Kliknij "New site from Git"
   - Wybierz repozytorium

2. **Konfiguracja build:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Zmienne środowiskowe:**
   - W ustawieniach site dodaj wszystkie zmienne środowiskowe

### Własny serwer

```bash
# Build aplikacji
npm run build

# Serwowanie plików statycznych
npm install -g serve
serve -s dist -l 3000
```

## 🔧 Troubleshooting

### Częste problemy

#### 1. Błąd połączenia z Supabase
```
Error: Invalid API key
```
**Rozwiązanie:**
- Sprawdź czy `VITE_SUPABASE_URL` i `VITE_SUPABASE_ANON_KEY` są poprawne
- Upewnij się, że używasz `anon` key, nie `service_role`
- Zrestartuj serwer deweloperski po zmianie `.env`

#### 2. Błąd CORS
```
Access to fetch blocked by CORS policy
```
**Rozwiązanie:**
- Dodaj domenę do **Site URL** w ustawieniach Supabase
- Sprawdź **Redirect URLs** w Authentication settings

#### 3. Błąd RLS (Row Level Security)
```
Row level security policy violation
```
**Rozwiązanie:**
- Sprawdź czy migracje zostały zastosowane
- Upewnij się, że użytkownik jest zalogowany
- Sprawdź polityki RLS w Supabase Dashboard

#### 4. Błąd podczas budowania
```
Module not found: Can't resolve '@/...'
```
**Rozwiązanie:**
- Sprawdź konfigurację path mapping w `vite.config.ts`
- Upewnij się, że wszystkie zależności są zainstalowane

### Logi i debugging

#### Development:
```bash
# Włącz szczegółowe logi Supabase
localStorage.setItem('supabase.auth.debug', 'true')

# Sprawdź logi w konsoli przeglądarki
console.log('Supabase client:', supabase)
```

#### Production:
- Sprawdź logi w Vercel/Netlify dashboard
- Użyj Supabase Dashboard do monitorowania zapytań
- Sprawdź Network tab w Developer Tools

### Kontakt i wsparcie

- **GitHub Issues:** [Zgłoś problem](https://github.com/nmatjar/cosmic-echoes-guide/issues)
- **Dokumentacja Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Dokumentacja Vite:** [vitejs.dev](https://vitejs.dev)

---

## 📚 Dodatkowe zasoby

- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**CosmoFlow by ARCĀNUM** - *Ancient Wisdom, AI Insights*

© 2025 ARCĀNUM. Wszelkie prawa zastrzeżone.
