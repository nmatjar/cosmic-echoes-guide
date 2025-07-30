
# Instrukcja Integracji z Supabase

Ten dokument opisuje kroki niezbędne do zintegrowania aplikacji Cosmic Echoes Guide z Supabase w celu przechowywania profili użytkowników w chmurze.

## Krok 1: Konfiguracja projektu w Supabase

1.  **Załóż konto** na [supabase.com](https://supabase.com) i utwórz nowy projekt.
2.  **Zapisz klucze API**: W ustawieniach projektu (`Project Settings -> API`) znajdź i zapisz `Project URL` oraz klucz `anon public`. Będą potrzebne w aplikacji.
3.  **Stwórz tabelę `profiles`**: Przejdź do `Table Editor` i utwórz nową tabelę o nazwie `profiles` z następującymi kolumnami:
    *   `id`: `uuid` (ustaw jako Primary Key, domyślnie `uuid_generate_v4()`)
    *   `user_id`: `uuid` (to będzie klucz obcy do tabeli `auth.users`)
    *   `name`: `text`
    *   `birth_data`: `jsonb` (będzie przechowywać `{ "date": "..." }`)
    *   `analysis`: `jsonb` (będzie przechowywać cały obiekt `ComprehensiveAnalysis` z wynikami wszystkich modułów: numerologii, astrologii, chińskiego zodiaku, human design, Majów, bio-rytmów, równowagi żywiołów)
    *   `created_at`: `timestamp with time zone` (domyślnie `now()`)
    *   `updated_at`: `timestamp with time zone` (domyślnie `now()`)

4.  **Włącz autentykację**: Przejdź do sekcji `Authentication` i skonfiguruj preferowane metody logowania (np. email/hasło, Google, etc.).

### Struktura `UserProfile` w Supabase

Obiekt `UserProfile` zdefiniowany w `src/engine/userProfile.ts` będzie mapowany na tabelę `profiles` w następujący sposób:

*   `id`: mapuje się na kolumnę `id` (uuid)
*   `name`: mapuje się na kolumnę `name` (text)
*   `birthData`: mapuje się na kolumnę `birth_data` (jsonb). Będzie zawiera `{ date: string }`.
*   `analysis`: mapuje się na kolumnę `analysis` (jsonb). Będzie zawierać pełny obiekt `ComprehensiveAnalysis` z wynikami wszystkich modułów analitycznych (np. `numerology`, `astrology`, `chineseZodiac`, `humanDesign`, `mayan`, `biorhythms`, `elementalBalance`).
*   `createdAt`: mapuje się na kolumnę `created_at` (timestamp with time zone)
*   `updatedAt`: mapuje się na kolumnę `updated_at` (timestamp with time zone)
*   `pin`: **UWAGA**: Pole `pin` z `UserProfile` **nie powinno** być przechowywane bezpośrednio w Supabase ze względów bezpieczeństwa. Jeśli wymagane jest uwierzytelnianie PIN-em, należy zaimplementować bezpieczne haszowanie i przechowywanie PIN-u po stronie serwera lub wykorzystać wbudowane mechanizmy autentykacji Supabase.

#### **Personal Diagnostic Systems (✨)** (New in 3.4)
Properties related to insights derived from various personal diagnostic and esoteric systems. These are typically static, derived from birth data, and provide deep personal understanding.

##### 2.2.27 Numerology (🔢) (New)
Properties related to numerological analysis.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| LP | 🔢 | Life Path Number | Core life path number | [Numeric Value] (e.g., 1-9, 11, 22, 33) |
| EX | ✨ | Expression Number | How one expresses themselves | [Numeric Value] |
| SU | ❤️ | Soul Urge Number | Inner desires and motivations | [Numeric Value] |
| INT | 📝 | Interpretations | Detailed interpretations (can be structured JSON) | [JSON/Structured Text] |

##### 2.2.28 Astrological Profile (🌌) (New)
Properties related to astrological chart analysis.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| SS | ☀️ | Sun Sign | Primary zodiac sign | [Text] (e.g., Aries, Taurus) |
| AS | ⬆️ | Ascendant | Rising sign | [Text] |
| MC | 🏆 | Midheaven | Career and public image | [Text] |
| PL | 🪐 | Planetary Positions | Positions of planets in signs/houses | [JSON/Structured Text] (e.g., {"Mars":"Aries", "Venus":"Taurus"}) |
| HO | 🏠 | House Cusps | Start of each astrological house | [JSON/Structured Text] |
| ASP | 🔗 | Aspects | Angles between planets | [JSON/Structured Text] |

##### 2.2.29 Chinese Zodiac (🐉) (New)
Properties related to Chinese Zodiac analysis.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| AN | 🐾 | Animal Sign | Main animal sign | [Text] (e.g., Dragon, Tiger) |
| EL | 🌳 | Element | Associated element | [Text] (e.g., Wood, Fire, Earth, Metal, Water) |
| POL | ☯️ | Polarity | Yin, Yang | Yin, Yang |
| INT | 📝 | Interpretations | Detailed interpretations | [JSON/Structured Text] |

##### 2.2.30 Human Design (🧬) (New)
Properties related to Human Design analysis.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| TY | 🎭 | Type | Energy type | Generator, Manifestor, Projector, Reflector, Manifesting Generator |
| PR | 👑 | Profile | Personality and design lines | [Text] (e.g., 1/3, 2/4, 6/2) |
| AU | 🎯 | Authority | Inner decision-making guide | Sacral, Emotional, Splenic, Ego, Self-Projected, Lunar |
| CEN | ⚡ | Centers | Activated and open centers | [JSON/Structured Text] (e.g., {"Sacral":"Defined", "Spleen":"Open"}) |
| CHA | 🔗 | Channels | Defined channels | [JSON/Structured Text] |
| GAT | 🚪 | Gates | Activated gates | [Array of Numeric Values] |
| INT | 📝 | Interpretations | Detailed interpretations | [JSON/Structured Text] |

##### 2.2.31 Mayan Calendar (🏛️) (New)
Properties related to Mayan Calendar analysis.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| SI | ☀️ | Sign (Kin) | Mayan day sign | [Text] (e.g., Red Dragon, White Wind) |
| TO | 🔢 | Tone | Galactic tone | [Numeric Value] (1-13) |
| WAV | 🌊 | Wavespell | Associated wavespell | [Text] |
| DEST | 🌟 | Destiny Kin | Overall destiny kin | [Numeric Value] |
| INT | 📝 | Interpretations | Detailed interpretations | [JSON/Structured Text] |

##### 2.2.32 Bio-Rhythms (🧬⏰) (New)
Properties related to personal biological and energetic cycles.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| PH | 🏃 | Physical Cycle | Current state of physical energy | High, Medium, Low, Critical |
| EM | ❤️ | Emotional Cycle | Current state of emotional sensitivity | High, Medium, Low, Critical |
| IN | 🧠 | Intellectual Cycle | Current state of mental clarity | High, Medium, Low, Critical |
| CYC | 🔄 | Cycle Peaks/Troughs | Predicted peak/trough days for each cycle | [JSON/Structured Text] (e.g., {"Physical":["2025-08-01","2025-08-15"]}) |
| INT | 📝 | Interpretations | Daily guidance based on combined cycles | [JSON/Structured Text] |

##### 2.2.33 Elemental Balance (☯️🌳) (New)
Properties related to the balance and influence of fundamental elements in an individual's profile.

| ID | Property | Name | Description | Possible Values |
|----|----------|------|-------------|-----------------|
| FIR | 🔥 | Fire Element | Influence of Fire energy | [Numeric Scale/Text] (e.g., High, Balanced, Low) |
| EAR | 🌍 | Earth Element | Influence of Earth energy | [Numeric Scale/Text] |
| AIR | 🌬️ | Air Element | Influence of Air energy | [Numeric Scale/Text] |
| WAT | 💧 | Water Element | Influence of Water energy | [Numeric Scale/Text] |
| ETH | ✨ | Ether/Spirit Element | Influence of Ether/Spirit energy (optional) | [Numeric Scale/Text] |
| DOM | 👑 | Dominant Elements | Most prominent elements | [Array of Text] (e.g., ["Fire", "Water"]) |
| WEAK | 📉 | Weak Elements | Least prominent elements | [Array of Text] |
| INT | 📝 | Interpretations | Insights based on elemental balance | [JSON/Structured Text] |

## Krok 2: Implementacja w kodzie aplikacji

### 1. Instalacja bibliotek

```bash
npm install @supabase/supabase-js
```

### 2. Konfiguracja klienta Supabase

Utwórz plik `src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Zmienne środowiskowe
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

*Pamiętaj o dodaniu zmiennych środowiskowych (np. w pliku `.env`) i skonfigurowaniu Vite, aby je odczytywał.*

### 3. Serwis do obsługi profili w chmurze

Rozbuduj lub stwórz nowy serwis, np. `src/services/cloudProfileManager.ts`, który będzie komunikował się z API Supabase:

```typescript
import { supabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/engine/userProfile';

// Pobierz profil zalogowanego użytkownika
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as UserProfile;
};

// Zapisz/zaktualizuj profil użytkownika
export const saveUserProfile = async (profile: Partial<UserProfile>, userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ ...profile, user_id: userId, updated_at: new Date().toISOString() })
    .select();

  if (error) {
    console.error('Error saving profile:', error);
  }
  return data;
};
```

### 4. Integracja z komponentami

*   **Logowanie**: Użyj komponentów UI od Supabase lub stwórz własne, aby obsłużyć logowanie. Po zalogowaniu uzyskasz dostęp do `session.user.id`.
*   **Synchronizacja**: Po zalogowaniu, pobierz profil z Supabase. Jeśli nie istnieje, utwórz go na podstawie danych lokalnych. Wszelkie zmiany w profilu powinny być wysyłane do Supabase przez `saveUserProfile`.
*   **Praca offline**: Aplikacja powinna najpierw korzystać z `profileManager.ts` (localStorage), a w tle próbować synchronizować dane z chmurą.

## Krok 3: Zabezpieczenia (Row Level Security)

To najważniejszy krok, aby użytkownicy nie mieli dostępu do swoich danych nawzajem.

1.  Przejdź do `Authentication -> Policies` w Supabase.
2.  Dla tabeli `profiles` włącz **Row Level Security**.
3.  Stwórz polityki, np.:
    *   **SELECT**: `auth.uid() = user_id` (Użytkownik może odczytać tylko własny profil).
    *   **INSERT**: `auth.uid() = user_id` (Użytkownik może stworzyć profil tylko dla siebie).
    *   **UPDATE**: `auth.uid() = user_id` (Użytkownik może aktualizować tylko własny profil).

---

Ta instrukcja stanowi podstawę do dalszej implementacji. Należy ją dostosować do specyficznych potrzeb aplikacji, np. obsługi błędów, stanu ładowania, czy bardziej złożonej logiki synchronizacji.
