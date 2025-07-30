# ✨ Cosmic Echoes Guide ✨

## Odkryj Swój Kosmiczny Portret Duszy

**Cosmic Echoes Guide** to innowacyjna aplikacja webowa, która pozwala użytkownikom odkrywać swoją unikalną duchową esencję poprzez pryzmat starożytnych systemów mądrości. Wykorzystując datę urodzenia, aplikacja generuje spersonalizowane analizy z różnych dziedzin, takich jak Numerologia, Astrologia, Chiński Zodiak, Human Design, Kalendarz Majów, Bio-Rytmy oraz Równowaga Żywiołów.

### Kluczowe Funkcje:

*   **Kompleksowa Analiza Profilu:** Uzyskaj szczegółowe odczyty z wielu systemów diagnostycznych, które oferują głębokie wglądy w Twoją osobowość, potencjał i ścieżkę życiową.
*   **Spersonalizowane Wskazówki Dnia (AI-Ready):** Zobacz dzienne wpływy z Bio-Rytmów i Kalendarza Majów. Wygeneruj specjalny prompt, który możesz wykorzystać z zaawansowanymi modelami AI, aby uzyskać spersonalizowaną interpretację tego, co dany dzień wnosi konkretnie dla Ciebie.
*   **Lokalne Zarządzanie Profilami:** Twórz i przechowuj wiele profili użytkowników bezpośrednio w przeglądarce (localStorage), z możliwością łatwego przełączania się między nimi.
*   **Eksport i Udostępnianie:** Eksportuj swój pełny Kosmiczny Portret Duszy do pliku JSON, aby zachować go lub udostępnić.
*   **Intuicyjny Interfejs Użytkownika:** Czysty, nowoczesny design oparty na Shadcn UI i Tailwind CSS, zapewniający płynne i przyjemne doświadczenie.
*   **Rozszerzalny Silnik Analityczny:** Modułowa architektura silnika pozwala na łatwe dodawanie nowych systemów analitycznych w przyszłości.
*   **Gotowość na Integrację z Chmurą:** Przygotowana architektura do synchronizacji profili z bazą danych Supabase, zapewniająca bezpieczeństwo i dostępność danych w chmurze.
*   **Zgodność ze Standardem ProfileCoder (Propozycja):** Aplikacja jest zaprojektowana z myślą o zgodności z rozszerzonym standardem ProfileCoder 3.4, co umożliwia interoperacyjność danych profilowych z innymi systemami.

## Technologie:

*   **Frontend:** React, TypeScript, Vite
*   **Styling:** Tailwind CSS, Shadcn UI
*   **Zarządzanie Stanem:** React Hooks
*   **Testowanie:** Vitest, JSDOM
*   **Zarządzanie Pakietami:** npm
*   **Inne:** date-fns, lucide-react, recharts, sonner, uuid, zod

## Status Projektu:

🎉 **Projekt jest w pełni funkcjonalny i gotowy do użycia!**

- ✅ **Wszystkie błędy kompilacji naprawione** (30.07.2025)
- ✅ **30 testów przechodzi pomyślnie**
- ✅ **Build production działa bez błędów**
- ✅ **Aplikacja przetestowana w przeglądarce**
- ✅ **Wszystkie komponenty renderują się poprawnie**
- ✅ **Formularz i nawigacja działają prawidłowo**

### Ostatnie naprawy (30.07.2025):
- Naprawiono duplikaty zmiennych w `AstrologicalSection.tsx`
- Dodano null safety checks w `CosmicLogin.tsx`
- Dodano brakujące importy w komponentach sekcji
- Naprawiono import polskiej lokalizacji w `BioRhythmSection.tsx`
- Usunięto duplikację deklaracji w silniku analitycznym

## Rozpoczęcie Pracy (Development):

Aby uruchomić projekt lokalnie, wykonaj następujące kroki:

1.  **Klonowanie Repozytorium:**
    ```bash
    git clone https://github.com/nmatjar/cosmic-echoes-guide.git
    cd cosmic-echoes-guide
    ```

2.  **Instalacja Zależności:**
    ```bash
    npm install
    ```

3.  **Uruchomienie Serwera Deweloperskiego:**
    ```bash
    npm run dev
    ```
    Aplikacja będzie dostępna pod adresem `http://localhost:8080/`

4.  **Uruchamianie Testów:**
    ```bash
    npm test
    ```

5.  **Build Production:**
    ```bash
    npm run build
    ```

## Struktura Projektu:

```
cosmic-echoes-guide/
├── public/                 # Zasoby publiczne (favicon, obrazy)
├── src/
│   ├── App.css             # Główne style aplikacji
│   ├── App.tsx             # Główny komponent aplikacji
│   ├── main.tsx            # Punkt wejścia aplikacji
│   ├── components/         # Komponenty UI i funkcjonalne
│   │   ├── ui/             # Komponenty Shadcn UI
│   │   └── ...             # Komponenty sekcji analitycznych (AstrologicalSection, NumerologySection, etc.)
│   │   └── DailyInsightsSection.tsx # Nowa sekcja z dziennymi wpływami
│   ├── engine/             # Silnik analityczny i moduły
│   │   ├── data/           # Dane dla modułów (np. numerology.json, astrology.json)
│   │   ├── modules/        # Moduły analityczne (numerology.ts, astrology.ts, etc.)
│   │   ├── index.ts        # Główny plik silnika
│   │   ├── types.ts        # Definicje typów dla silnika
│   │   └── userProfile.ts  # Definicja struktury profilu użytkownika
│   ├── hooks/              # Customowe hooki React
│   ├── lib/                # Utility functions
│   ├── pages/              # Strony aplikacji (Index.tsx, NotFound.tsx)
│   └── services/           # Serwisy (np. profileManager.ts do zarządzania profilami lokalnie)
├── SUPABASE_INTEGRATION.md # Instrukcja integracji z Supabase
├── PROFILECODER_3_4_PATCH.md # Propozycja rozszerzenia standardu ProfileCoder
├── TODO.md                 # Lista zadań do wykonania
├── package.json            # Konfiguracja projektu i zależności
├── vite.config.ts          # Konfiguracja Vite i Vitest
└── ...                     # Inne pliki konfiguracyjne (.gitignore, tsconfig.json, etc.)
```

## SEO i Metadane:

Aplikacja jest zoptymalizowana pod kątem wyszukiwarek internetowych poprzez odpowiednie metadane w pliku `index.html`:

*   **Title:** `Cosmic Echoes Guide - Odkryj Swój Kosmiczny Portret Duszy`
*   **Description:** `Kompleksowa analiza osobowości i duchowej ścieżki z wykorzystaniem Numerologii, Astrologii, Human Design, Kalendarza Majów, Chińskiego Zodiaku, Bio-Rytmów i Równowagi Żywiołów. Spersonalizowane wglądy i codzienne wskazówki.`
*   **Keywords:** `numerologia, astrologia, human design, kalendarz Majów, chiński zodiak, bio-rytmy, równowaga żywiołów, rozwój osobisty, duchowość, samopoznanie, portret duszy, analiza osobowości, horoskop, wróżby, AI, spersonalizowane wglądy`
*   **Favicon:** Ikona aplikacji dla lepszej rozpoznawalności.

## Licencja:

Ten projekt jest udostępniany na licencji [MIT License](LICENSE). (Jeśli istnieje plik LICENSE, w przeciwnym razie usuń lub zmień).

---

© 2025 Cosmic Echoes Guide. Wszelkie prawa zastrzeżone.
