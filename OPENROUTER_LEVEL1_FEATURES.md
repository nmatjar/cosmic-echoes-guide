# OpenRouter Level 1 Features - Dokumentacja

## Przegląd

Implementacja funkcji Poziomu 1 dla integracji z OpenRouter API, która wprowadza zaawansowane zarządzanie kosztami, cache'owanie odpowiedzi, automatyczny wybór modeli i obsługę błędów z retry logic.

## Nowe Komponenty

### 1. OpenRouterOptimizer (`src/services/openRouterOptimizer.ts`)

Główny serwis optymalizacji zawierający:

#### Funkcje Cache'owania
- **Automatyczne cache'owanie odpowiedzi** - zmniejsza koszty i poprawia wydajność
- **TTL (Time To Live)** - kontrola czasu życia cache'a
- **Inteligentne czyszczenie** - automatyczne usuwanie starych wpisów
- **Klucze cache oparte na hash'ach** - unikalne identyfikatory dla różnych zapytań

#### Śledzenie Kosztów
- **Tracking kosztów w czasie rzeczywistym** - monitorowanie wydatków
- **Limity budżetu** - kontrola maksymalnych wydatków na sesję
- **Koszty per model** - szczegółowe raportowanie dla każdego modelu
- **Persistent storage** - zachowanie danych między sesjami

#### Dynamiczny Wybór Modeli
- **Kryteria wyboru** - typ zadania, złożoność, priorytet, długość kontekstu
- **Scoring algorytm** - automatyczny wybór optymalnego modelu
- **Budget-aware selection** - uwzględnienie dostępnego budżetu
- **Fallback models** - zapasowe opcje w przypadku niedostępności

#### Enhanced Error Handling
- **Retry logic z exponential backoff** - inteligentne ponawianie zapytań
- **Rate limit handling** - obsługa limitów API
- **Model unavailable fallbacks** - automatyczne przełączanie na dostępne modele
- **Network error recovery** - obsługa problemów sieciowych

### 2. Enhanced OpenRouterService (`src/services/openRouterService.ts`)

Rozszerzony serwis z nowymi metodami:

#### Nowe Metody
- `generateEnhancedResponse()` - zaawansowana generacja z pełną kontrolą
- `getCostTracker()` - pobieranie statystyk kosztów
- `resetSessionCost()` - resetowanie kosztów sesji
- `setBudgetLimit()` - ustawianie limitów budżetu

#### Automatyczne Funkcje
- **Auto-model selection** - automatyczny wybór modelu na podstawie kryteriów
- **Cache integration** - automatyczne wykorzystanie cache'a
- **Cost tracking** - automatyczne śledzenie kosztów
- **Error handling** - zaawansowana obsługa błędów

### 3. Enhanced Types (`src/types/council.ts`)

Nowe typy TypeScript:

```typescript
// Model selection criteria
interface ModelSelectionCriteria {
  task_type: 'reasoning' | 'creative' | 'analytical' | 'conversational' | 'planning';
  complexity: 'low' | 'medium' | 'high';
  priority: 'speed' | 'quality' | 'cost';
  context_length_needed: number;
  budget_remaining?: number;
}

// Cost tracking
interface CostTracker {
  total_tokens: number;
  total_cost: number;
  requests_count: number;
  session_cost: number;
  budget_limit?: number;
  cost_per_model: Record<string, number>;
}

// Cache entries
interface CacheEntry {
  key: string;
  response: string;
  agent: CouncilAgent;
  timestamp: number;
  ttl: number;
  usage_count: number;
}

// Error handling
interface OpenRouterError {
  type: 'rate_limit' | 'model_unavailable' | 'insufficient_quota' | 'network' | 'unknown';
  message: string;
  retry_after?: number;
  suggested_model?: string;
}
```

## Konfiguracja Modeli

### Dostępne Modele z Konfiguracją

```typescript
const modelConfigs = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    cost_per_token: 0.000003,
    context_length: 200000,
    strengths: ['reasoning', 'analytical', 'conversational'],
    speed_score: 7,
    quality_score: 10,
    cost_score: 6
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    cost_per_token: 0.00000015,
    context_length: 128000,
    strengths: ['conversational', 'analytical'],
    speed_score: 9,
    quality_score: 7,
    cost_score: 10
  },
  // ... więcej modeli
];
```

## Przykłady Użycia

### 1. Podstawowe Użycie z Auto-Selection

```typescript
const openRouterService = new OpenRouterService(apiKey);

// Automatyczny wybór modelu na podstawie zadania
const response = await openRouterService.generateCouncilResponse(
  "Jak mogę poprawić swoją produktywność?",
  userProfile,
  chatHistory,
  'architect' // opcjonalny agent
);
```

### 2. Zaawansowane Użycie z Kontrolą Budżetu

```typescript
const response = await openRouterService.generateEnhancedResponse(
  "Przeanalizuj mój profil astrologiczny",
  userProfile,
  chatHistory,
  {
    priority: 'quality',        // priorytet: jakość
    budgetLimit: 0.10,         // limit $0.10 na sesję
    selectedAgent: 'oracle',   // wybrany agent
    useStreaming: false        // bez streamingu (Level 2)
  }
);

console.log('Użyty model:', response.metadata.model);
console.log('Koszt:', response.metadata.estimated_cost);
console.log('Kryteria:', response.metadata.selection_criteria);
```

### 3. Zarządzanie Kosztami

```typescript
// Ustawienie limitu budżetu
openRouterService.setBudgetLimit(0.50); // $0.50 na sesję

// Sprawdzenie aktualnych kosztów
const costTracker = openRouterService.getCostTracker();
console.log('Całkowity koszt:', costTracker.total_cost);
console.log('Koszt sesji:', costTracker.session_cost);
console.log('Liczba zapytań:', costTracker.requests_count);

// Reset kosztów sesji
openRouterService.resetSessionCost();
```

### 4. Cache Management

```typescript
// Cache jest zarządzany automatycznie, ale można sprawdzić:
const cacheKey = openRouterOptimizer.generateCacheKey(
  userMessage, 
  model, 
  agent
);

const cachedResponse = openRouterOptimizer.getCachedResponse(cacheKey);
if (cachedResponse) {
  console.log('Znaleziono w cache:', cachedResponse.response);
  console.log('Użycia:', cachedResponse.usage_count);
}
```

## Algorytm Wyboru Modelu

### Kryteria Oceny

1. **Typ Zadania**
   - `reasoning` → modele analityczne (Claude, GPT-4)
   - `creative` → modele kreatywne (GPT-4, Claude)
   - `conversational` → szybkie modele (GPT-4o-mini, Haiku)
   - `analytical` → modele precyzyjne (Claude, Gemini)
   - `planning` → modele strategiczne (Claude, GPT-4)

2. **Złożoność**
   - `low` → priorytet dla szybkości
   - `medium` → balans jakość/szybkość
   - `high` → priorytet dla jakości

3. **Priorytet**
   - `speed` → 60% szybkość, 30% jakość, 10% koszt
   - `quality` → 60% jakość, 20% szybkość, 20% koszt
   - `cost` → 60% koszt, 20% szybkość, 20% jakość

### Scoring Formula

```typescript
let score = 0;
switch (priority) {
  case 'speed':
    score = model.speed_score * 0.6 + model.quality_score * 0.3 + model.cost_score * 0.1;
    break;
  case 'quality':
    score = model.quality_score * 0.6 + model.speed_score * 0.2 + model.cost_score * 0.2;
    break;
  case 'cost':
    score = model.cost_score * 0.6 + model.speed_score * 0.2 + model.quality_score * 0.2;
    break;
}

// Bonus za złożoność
if (complexity === 'high' && model.quality_score >= 8) score += 1;
if (complexity === 'low' && model.speed_score >= 8) score += 1;
```

## Error Handling & Retry Logic

### Typy Błędów

1. **Rate Limit (429)** - automatyczne retry z delay
2. **Insufficient Quota (402)** - błąd budżetu
3. **Model Unavailable (503)** - przełączenie na fallback
4. **Network Error** - retry z exponential backoff

### Retry Configuration

```typescript
const retryConfig = {
  max_attempts: 3,
  base_delay: 1000,      // 1 sekunda
  max_delay: 10000,      // 10 sekund
  backoff_factor: 2      // podwajanie delay
};
```

### Przykład Retry Logic

```typescript
for (let attempt = 1; attempt <= max_attempts; attempt++) {
  try {
    return await operation();
  } catch (error) {
    const parsedError = parseError(error);
    
    if (!shouldRetry(parsedError, attempt)) {
      throw parsedError;
    }

    const delay = Math.min(
      base_delay * Math.pow(backoff_factor, attempt - 1),
      max_delay
    );

    await sleep(delay);
  }
}
```

## Cache Strategy

### Cache Key Generation

```typescript
generateCacheKey(prompt: string, model: string, agent?: string): string {
  const normalizedPrompt = prompt.toLowerCase().trim();
  return `${model}:${agent || 'auto'}:${hashString(normalizedPrompt)}`;
}
```

### TTL Management

- **Domyślny TTL**: 1 godzina (3600000ms)
- **Automatyczne czyszczenie**: gdy cache > 1000 wpisów
- **LRU eviction**: usuwanie najmniej używanych wpisów

### Cache Cleanup

```typescript
// Usuwanie wygasłych wpisów
entries.forEach(([key, entry]) => {
  if (now > entry.timestamp + entry.ttl) {
    cache.delete(key);
  }
});

// Usuwanie najmniej używanych (jeśli nadal za duży)
if (cache.size > 800) {
  const sortedEntries = entries.sort((a, b) => a[1].usage_count - b[1].usage_count);
  const toRemove = sortedEntries.slice(0, 200);
  toRemove.forEach(([key]) => cache.delete(key));
}
```

## Monitoring i Analytics

### Dostępne Metryki

1. **Koszty**
   - Całkowity koszt
   - Koszt sesji
   - Koszt per model
   - Liczba zapytań

2. **Performance**
   - Cache hit rate
   - Średni czas odpowiedzi
   - Retry attempts

3. **Usage**
   - Najpopularniejsze modele
   - Najczęściej używane agenci
   - Wzorce użycia

### Persistent Storage

Dane kosztów są zapisywane w localStorage:

```typescript
// Automatyczne zapisywanie
localStorage.setItem('openrouter_cost_tracker', JSON.stringify(costTracker));

// Automatyczne ładowanie przy starcie
const saved = localStorage.getItem('openrouter_cost_tracker');
if (saved) {
  costTracker = { ...costTracker, ...JSON.parse(saved) };
}
```

## Bezpieczeństwo

### API Key Management

- Klucz API przechowywany bezpiecznie w zmiennych środowiskowych
- Walidacja klucza przed każdym zapytaniem
- Automatyczne ukrywanie klucza w logach

### Budget Protection

- Sprawdzanie limitu przed każdym zapytaniem
- Automatyczne blokowanie przy przekroczeniu
- Ostrzeżenia przy zbliżaniu się do limitu

### Error Logging

- Bezpieczne logowanie błędów (bez wrażliwych danych)
- Kategoryzacja błędów dla łatwiejszego debugowania
- Metryki błędów dla monitorowania

## Roadmap - Level 2 Features

Planowane funkcje na przyszłość:

1. **Streaming Responses** - odpowiedzi w czasie rzeczywistym
2. **Advanced Analytics** - szczegółowe analizy użycia
3. **Model Performance Tracking** - śledzenie wydajności modeli
4. **Custom Model Configs** - możliwość dodawania własnych modeli
5. **A/B Testing** - testowanie różnych strategii
6. **Advanced Caching** - cache z kompresją i sharding
7. **Real-time Cost Alerts** - powiadomienia o kosztach
8. **Usage Predictions** - przewidywanie kosztów

## Troubleshooting

### Częste Problemy

1. **"Model not available"**
   - Sprawdź dostępność modelu w OpenRouter
   - Użyj fallback modelu
   - Sprawdź klucz API

2. **"Budget exceeded"**
   - Zwiększ limit budżetu
   - Zresetuj koszt sesji
   - Użyj tańszych modeli

3. **"Cache not working"**
   - Sprawdź localStorage
   - Wyczyść cache ręcznie
   - Sprawdź TTL settings

4. **"Slow responses"**
   - Użyj szybszych modeli
   - Zmniejsz context length
   - Sprawdź retry settings

### Debug Mode

```typescript
// Włączenie szczegółowych logów
localStorage.setItem('openrouter_debug', 'true');

// Sprawdzenie cache
console.log('Cache size:', openRouterOptimizer.cache.size);
console.log('Cost tracker:', openRouterOptimizer.getCostTracker());
```

## Podsumowanie

Level 1 Features wprowadzają profesjonalne zarządzanie integracją z OpenRouter API, znacznie poprawiając wydajność, kontrolę kosztów i niezawodność systemu. Wszystkie funkcje są w pełni zautomatyzowane i nie wymagają dodatkowej konfiguracji od użytkownika końcowego.
