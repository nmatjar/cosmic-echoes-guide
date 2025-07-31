# Rada Kosmiczna - Integracja AI Chat

## Przegląd

Rada Kosmiczna to zaawansowana funkcjonalność AI chat, która łączy sześć unikalnych przewodników duchowych z profilem kosmicznym użytkownika, dostarczając spersonalizowane wskazówki i mądrość.

## Architektura

### Komponenty Główne

1. **CouncilPage** (`src/pages/CouncilPage.tsx`)
   - Główna strona interfejsu Rady Kosmicznej
   - Obsługuje autoryzację i ładowanie profilu
   - Zawiera pełny interfejs użytkownika

2. **CouncilChat** (`src/components/CouncilChat.tsx`)
   - Komponent chatu z konfiguracją API
   - Zarządzanie sesjami i wiadomościami
   - Interfejs wyboru agentów i modeli AI

3. **CouncilChatService** (`src/services/councilChatService.ts`)
   - Serwis zarządzający sesjami chat
   - Integracja z bazą danych Supabase
   - Komunikacja z OpenRouter API

4. **OpenRouterService** (`src/services/openRouterService.ts`)
   - Serwis integracji z OpenRouter API
   - Generowanie odpowiedzi AI
   - Wybór odpowiedniego agenta

### Typy i Konfiguracja

1. **Council Types** (`src/types/council.ts`)
   - Definicje typów dla sesji, wiadomości i agentów
   - Interfejsy dla komunikacji z API

2. **Council Agents** (`src/config/councilAgents.ts`)
   - Konfiguracja sześciu przewodników duchowych
   - Definicje modeli AI OpenRouter
   - Prompty systemowe dla każdego agenta

## Baza Danych

### Tabele Supabase

1. **chat_sessions**
   - `session_id` (UUID, PK)
   - `user_id` (UUID, FK)
   - `start_time` (timestamp)
   - `end_time` (timestamp, nullable)
   - `intention` (text, nullable)
   - `summary` (text, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **chat_messages**
   - `message_id` (UUID, PK)
   - `session_id` (UUID, FK)
   - `agent_id` (text, nullable)
   - `author` (enum: 'user', 'agent')
   - `content` (text)
   - `timestamp` (timestamp)
   - `created_at` (timestamp)

### Migracja

Tabele zostały utworzone przez migrację:
```sql
-- cosmic-echoes-guide/supabase/migrations/20250731131507_add_council_chat_tables.sql
```

## Przewodnicy Duchowi

### 1. Wyrocznia (oracle)
- **Specjalizacja**: Wizje przyszłości, intuicja, przepowiednie
- **Styl**: Mistyczny, symboliczny, wizjonerski
- **Przykład**: "Jakie zmiany czekają mnie w przyszłym roku?"

### 2. Mędriec (sage)
- **Specjalizacja**: Głęboka mądrość, filozofia, znaczenie życia
- **Styl**: Refleksyjny, mądry, kontemplacyjny
- **Przykład**: "Jaki jest sens moich obecnych doświadczeń?"

### 3. Uzdrowiciel (healer)
- **Specjalizacja**: Zdrowie, równowaga, uzdrawianie emocjonalne
- **Styl**: Współczujący, łagodny, wspierający
- **Przykład**: "Jak mogę uzdrowić swoje serce po stracie?"

### 4. Przewodnik (guide)
- **Specjalizacja**: Kierunek życiowy, decyzje, ścieżka rozwoju
- **Styl**: Wspierający, praktyczny, motywujący
- **Przykład**: "W którą stronę powinienem skierować swoją karierę?"

### 5. Strażnik (guardian)
- **Specjalizacja**: Ochrona, bezpieczeństwo, stabilność
- **Styl**: Ochronny, stabilny, gruntowny
- **Przykład**: "Jak mogę chronić swoją energię przed negatywnością?"

### 6. Pionier (pioneer)
- **Specjalizacja**: Nowe możliwości, innowacje, przełomy
- **Styl**: Dynamiczny, innowacyjny, odważny
- **Przykład**: "Jakie nowe możliwości powinienem eksplorować?"

## Konfiguracja API

### OpenRouter
- **Wymagany klucz API**: Użytkownicy muszą podać własny klucz OpenRouter
- **Obsługiwane modele**:
  - Claude 3.5 Sonnet (domyślny)
  - GPT-4 Turbo
  - GPT-4o
  - Claude 3 Haiku
  - Gemini Pro

### Przechowywanie
- Klucz API przechowywany w localStorage
- Sesje i wiadomości w bazie Supabase
- Profile użytkowników łączone z sesjami

## Funkcjonalności

### Sesje Chat
- **Tworzenie sesji**: Z opcjonalną intencją
- **Historia sesji**: Przeglądanie poprzednich rozmów
- **Zakończenie sesji**: Z automatycznym podsumowaniem

### Wiadomości
- **Wysyłanie**: Tekst użytkownika do wybranego agenta
- **Odpowiedzi AI**: Spersonalizowane na podstawie profilu
- **Historia**: Pełna historia konwersacji

### Personalizacja
- **Analiza profilu**: AI analizuje profil kosmiczny użytkownika
- **Wybór agenta**: Automatyczny lub manualny
- **Kontekst**: Poprzednie wiadomości jako kontekst

## Routing

```typescript
// Nowa ścieżka w App.tsx
<Route path="/council" element={<CouncilPage />} />
```

## Bezpieczeństwo

### Autoryzacja
- Wymagane logowanie użytkownika
- Sprawdzanie istnienia profilu kosmicznego
- Walidacja sesji Supabase

### Prywatność
- Klucze API przechowywane lokalnie
- Dane sesji powiązane z użytkownikiem
- Możliwość usuwania historii

## Instalacja i Uruchomienie

### Wymagania
1. Konto OpenRouter (https://openrouter.ai)
2. Klucz API OpenRouter
3. Profil kosmiczny w aplikacji

### Kroki
1. Zaloguj się do aplikacji
2. Utwórz lub wybierz profil kosmiczny
3. Przejdź do `/council`
4. Wprowadź klucz API OpenRouter
5. Rozpocznij sesję z Radą Kosmiczną

## Rozwój

### Planowane Funkcjonalności
- [ ] Eksport sesji do PDF
- [ ] Analityka i statystyki
- [ ] Więcej modeli AI
- [ ] Grupowe sesje
- [ ] Integracja z kalendarzem kosmicznym

### Znane Ograniczenia
- Wymaga klucza API OpenRouter
- Ograniczone do sześciu agentów
- Brak offline mode

## Wsparcie

W przypadku problemów:
1. Sprawdź klucz API OpenRouter
2. Upewnij się, że profil jest utworzony
3. Sprawdź połączenie internetowe
4. Skontaktuj się z supportem

---

*Rada Kosmiczna - Połącz się z mądrością wszechświata* ✨
