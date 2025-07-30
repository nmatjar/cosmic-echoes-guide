# 🌟 CosmoFlow by ARCĀNUM

## Find Your Life's Rhythm

**CosmoFlow by ARCĀNUM** to innowacyjna aplikacja, która harmonijnie łączy starożytną mądrość z nowoczesną technologią i sztuczną inteligencją, aby pomóc młodym dorosłym (20-35 lat) odnaleźć swój wewnętrzny rytm, zrozumieć siebie i żyć w zgodzie z uniwersalnymi przepływami.

### 🎯 Nasza Misja

Dostarczenie użytkownikom osobistych wglądów i praktycznych wskazówek, które wspierają rozwój osobisty, samopoznanie i harmonijne życie poprzez połączenie 7 starożytnych systemów mądrości z zaawansowaną technologią AI.

### ✨ Kluczowe Przesłania

- **Find Your Life's Rhythm** - Odkryj swój osobisty rytm i harmonię
- **Ancient Wisdom, AI Insights** - Unikalne połączenie tradycji i nowoczesności  
- **Your Flow, Your Life** - Przejmij kontrolę nad swoim życiem
- **Discover Your Blueprint** - Odkryj swój indywidualny plan życiowy

## 🔮 Systemy Mądrości

### **Numerologia**
Analiza liczb życiowych i ich wpływu na Twoją ścieżkę

### **Astrologia** 
Interpretacja znaków zodiaku i wpływów planetarnych

### **Chiński Zodiak**
Starożytna mądrość zwierząt i żywiołów

### **Human Design**
Nowoczesny system typów energetycznych

### **Kalendarz Majów**
Cykliczna mądrość czasu i energii

### **Bio-Rytmy**
Analiza naturalnych cykli biologicznych

### **Równowaga Żywiołów (Wu Xing)**
Harmonia pięciu pierwiastków natury

## 🚀 Technologie

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database:** Supabase
- **State Management:** React Query + React Hooks
- **Forms:** React Hook Form + Zod
- **Testing:** Vitest + JSDOM
- **Charts:** Recharts
- **Icons:** Lucide React

## 🎨 Design System

### Kolory Marki
- **Primary Blue (Cosmo):** `#4A90E2` - Spokój, umysł, technologia
- **Primary Green (Flow):** `#50E3C2` - Harmonia, wzrost, natura  
- **Accent Gold (Arcanum):** `#D4AF37` - Elegancja, mądrość, jakość
- **Soft Purple (Intuition):** `#B19CD9` - Intuicja, duchowość
- **Warm Peach (Warmth):** `#FFDAB9` - Ciepło, przyjazność

### Typografia
- **Nagłówki:** Montserrat / Poppins
- **Tekst główny:** Open Sans / Lato / Roboto

### Styl UI/UX
- Minimalistyczny design z dużą ilością białej przestrzeni
- Płynne animacje i przejścia
- Intuicyjna nawigacja oparta na ikonach
- Personalizacja dopasowana do użytkownika

## 📦 Instalacja

```bash
# Klonowanie repozytorium
git clone https://github.com/nmatjar/cosmic-echoes-guide.git
cd cosmic-echoes-guide

# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev
```

## 🔧 Konfiguracja

### Szybki start

1. **Klonowanie i instalacja:**
   ```bash
   git clone https://github.com/nmatjar/cosmic-echoes-guide.git
   cd cosmic-echoes-guide
   npm install
   ```

2. **Konfiguracja zmiennych środowiskowych:**
   ```bash
   cp .env.example .env.local
   # Edytuj .env.local z właściwymi kluczami Supabase
   ```

3. **Uruchomienie aplikacji:**
   ```bash
   npm run dev
   ```
   Aplikacja będzie dostępna pod `http://localhost:8083/`

### 📚 Szczegółowa konfiguracja

**Przeczytaj [CONFIGURATION.md](./CONFIGURATION.md)** dla kompletnych instrukcji dotyczących:
- 🗄️ Konfiguracji bazy danych Supabase
- 🔐 Zmiennych środowiskowych i bezpieczeństwa
- 🔑 Uwierzytelniania i OAuth
- 🚀 Deployment na Vercel/Netlify
- 🔧 Troubleshooting i debugging

### ⚠️ Wymagane zmienne środowiskowe

```bash
# Minimalna konfiguracja w .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Testowanie

```bash
# Uruchomienie testów
npm run test

# Testy z pokryciem
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build produkcyjny
npm run build

# Podgląd buildu
npm run preview
```

## 📱 Funkcje Aplikacji

### **Analiza Profilu**
- Kompleksowa analiza osobowości z 7 systemów
- Spersonalizowane interpretacje AI
- Szczegółowe raporty i wykresy

### **Dzienne Wglądy**
- Codzienne wpływy Bio-Rytmów i Kalendarza Majów
- Personalizowane wskazówki AI
- Praktyczne porady na każdy dzień

### **Zarządzanie Profilami**
- Lokalne przechowywanie w localStorage
- Synchronizacja z chmurą Supabase
- Eksport i import profili

### **Eksport Danych**
- Format JSON zgodny z ProfileCoder 3.4
- Udostępnianie wyników
- Backup profili

## 🏗️ Struktura Projektu

```
cosmic-echoes-guide/
├── public/                 # Zasoby publiczne
├── src/
│   ├── components/         # Komponenty React
│   │   ├── ui/            # Komponenty Shadcn UI
│   │   ├── auth/          # Komponenty uwierzytelniania
│   │   └── ...            # Sekcje analityczne
│   ├── engine/            # Silnik analityczny
│   │   ├── modules/       # Moduły systemów mądrości
│   │   ├── data/          # Dane referencyjne
│   │   └── types.ts       # Definicje typów
│   ├── services/          # Serwisy aplikacji
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Strony aplikacji
│   └── integrations/      # Integracje zewnętrzne
├── supabase/              # Konfiguracja bazy danych
└── ...                    # Pliki konfiguracyjne
```

## 🌟 Status Projektu

✅ **Projekt w pełni funkcjonalny i gotowy do użycia!**

### Ostatnie aktualizacje:
- ✅ Integracja z bazą danych Supabase
- ✅ System uwierzytelniania użytkowników  
- ✅ Synchronizacja profili w chmurze
- ✅ Wszystkie testy przechodzą pomyślnie
- ✅ Build produkcyjny bez błędów
- ✅ Rebranding na CosmoFlow by ARCĀNUM

## 🎯 Grupa Docelowa

**Młodzi dorośli (20-35 lat)** poszukujący:
- Samopoznania i rozwoju osobistego
- Harmonii w życiu codziennym
- Praktycznych wskazówek opartych na mądrości
- Nowoczesnych narzędzi do self-discovery
- Inspiracji do świadomego życia

## 🔮 Roadmapa

### Faza 1: Podstawy ✅
- [x] Implementacja 7 systemów mądrości
- [x] Interfejs użytkownika
- [x] Lokalne zarządzanie profilami

### Faza 2: Chmura ✅  
- [x] Integracja Supabase
- [x] Uwierzytelnianie użytkowników
- [x] Synchronizacja profili

### Faza 3: AI & Personalizacja 🚧
- [ ] Zaawansowane interpretacje AI
- [ ] Personalizowane rekomendacje
- [ ] Adaptacyjny interfejs

### Faza 4: Społeczność 📋
- [ ] Udostępnianie profili
- [ ] Społeczność użytkowników
- [ ] Porównania kompatybilności

## 📄 Licencja

MIT License - Zobacz [LICENSE](LICENSE) dla szczegółów.

---

**CosmoFlow by ARCĀNUM** - *Ancient Wisdom, AI Insights*

© 2025 ARCĀNUM. Wszelkie prawa zastrzeżone.
