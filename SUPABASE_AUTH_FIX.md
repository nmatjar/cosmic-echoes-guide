# 🔧 Naprawa Supabase Auth Redirect URLs

## Problem
Email potwierdzający logowanie przekierowuje na `http://localhost:3000` zamiast na właściwy host aplikacji.

**Aplikacja działa na:**
- **Production:** `https://cosmoflow.netlify.app`
- **Development:** `http://localhost:8086` (lub inny port)

## Rozwiązanie

### 1. Zaktualizuj ustawienia w Supabase Dashboard

1. Przejdź do [Supabase Dashboard](https://supabase.com/dashboard/project/muyiitnplujnauepbsqq)
2. Idź do **Authentication** → **URL Configuration**
3. W sekcji **Redirect URLs** dodaj następujące URL:

**Production URLs:**
```
https://cosmoflow.netlify.app
https://cosmoflow.netlify.app/
https://cosmoflow.netlify.app/auth/callback
```

**Development URLs:**
```
http://localhost:8086
http://localhost:8086/
http://localhost:8086/auth/callback
http://localhost:8080
http://localhost:8080/
http://localhost:8080/auth/callback
http://192.168.0.175:8086
http://192.168.0.175:8086/
```

4. W sekcji **Site URL** ustaw:
```
https://cosmoflow.netlify.app
```

### 2. Zaktualizuj zmienne środowiskowe

**Production (.env.production):**
```env
VITE_APP_URL=https://cosmoflow.netlify.app
VITE_SUPABASE_URL=https://muyiitnplujnauepbsqq.supabase.co
```

**Development (.env.local):**
```env
VITE_APP_URL=http://localhost:8086
VITE_SUPABASE_URL=https://muyiitnplujnauepbsqq.supabase.co
```

### 3. Konfiguracja Netlify

Sprawdź czy w Netlify Dashboard masz ustawione zmienne środowiskowe:

1. Idź do [Netlify Dashboard](https://app.netlify.com)
2. Wybierz projekt `cosmoflow`
3. Idź do **Site settings** → **Environment variables**
4. Dodaj/zaktualizuj:

```
VITE_APP_URL=https://cosmoflow.netlify.app
VITE_SUPABASE_URL=https://muyiitnplujnauepbsqq.supabase.co
VITE_SUPABASE_ANON_KEY=[twój-anon-key]
```

### 4. Restart i deploy

**Development:**
1. Zrestartuj serwer deweloperski: `npm run dev`
2. Wyczyść cache przeglądarki

**Production:**
1. Commit i push zmian do GitHub
2. Netlify automatycznie zrobi redeploy
3. Lub ręcznie trigger deploy w Netlify Dashboard

## Testowanie

**Production:**
1. Idź na `https://cosmoflow.netlify.app`
2. Przejdź do strony logowania
3. Wprowadź email i hasło
4. Sprawdź email potwierdzający
5. Kliknij link w emailu
6. Powinieneś zostać przekierowany na `https://cosmoflow.netlify.app`

**Development:**
1. Uruchom aplikację: `npm run dev`
2. Testuj na `http://localhost:8086`

## Dodatkowe uwagi

- **Priorytet:** Supabase używa pierwszego pasującego URL z listy
- **Propagacja:** Zmiany w Supabase mogą potrzebować 5-10 minut
- **Cache:** Wyczyść cache przeglądarki po zmianach
- **HTTPS:** Production zawsze używa HTTPS
- **Wildcard:** Możesz użyć `https://*.netlify.app` dla wszystkich subdomen

## Debugowanie

Jeśli nadal masz problemy:

1. **Sprawdź console przeglądarki** - szukaj błędów CORS
2. **Sprawdź Network tab** - zobacz jakie requesty są wysyłane
3. **Sprawdź Supabase logs** - w Dashboard → Logs
4. **Sprawdź Netlify logs** - w Dashboard → Functions → View logs
