import type { Config, Context } from "@netlify/functions";

// @deno-types="https://esm.sh/v135/@types/node@20.12.12/index.d.ts"
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// --- Symulacja globalnego środowiska przeglądarki ---
// Biblioteka hdkit jest napisana w starym stylu i oczekuje, że będzie uruchamiana w przeglądarce.
// Tworzymy podstawowe globalne obiekty, których oczekuje.
const globalThis: any = {};
globalThis.window = globalThis;
globalThis.self = globalThis;

// --- Ładowanie i wykonywanie skryptów hdkit ---
// Te skrypty nie są modułami, więc musimy je wczytać i wykonać w globalnym kontekście,
// który właśnie stworzyliśmy. Kolejność ma znaczenie.
const currentModulePath = dirname(fileURLToPath(import.meta.url));
const hdkitPath = join(currentModulePath, "hdkit");

const scriptsToLoad = [
  "constants.js",
  "gates.js",
  "planets.js",
  "signs.js",
  "substructure.js",
  "models/chart.js" 
];

scriptsToLoad.forEach(scriptPath => {
  const scriptContent = readFileSync(join(hdkitPath, scriptPath), "utf8");
  // Używamy `eval` w kontekście naszego `globalThis`, aby skrypty myślały, że są w przeglądarce.
  // To nie jest idealne, ale konieczne ze względu na archaiczną strukturę biblioteki.
  (new Function(scriptContent)).call(globalThis);
});

// --- Główny handler funkcji Netlify ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export default async (req: Request, context: Context) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { birthDate, birthTime, birthLocation } = await req.json();

    if (!birthDate || !birthTime) {
      throw new Error("Brakuje daty lub godziny urodzenia.");
    }

    // Po wykonaniu skryptów, `Chart` powinien być dostępny w naszym globalnym obiekcie.
    const Chart = globalThis.Chart;
    if (!Chart) {
      throw new Error("Biblioteka HDKit nie została poprawnie załadowana.");
    }

    // Biblioteka oczekuje daty w specyficznym formacie.
    const dateString = `${birthDate} ${birthTime}`;
    
    // Tworzymy nowy "chart" (bodygraph)
    const chart = new Chart({
      name: "User",
      dateString: dateString,
      location: birthLocation
    });

    // Czekamy na asynchroniczne obliczenia (biblioteka używa callbacków, więc musimy to opakować w Promise)
    await new Promise<void>((resolve, reject) => {
      // Ta biblioteka nie ma formalnego sposobu na powiadamianie o zakończeniu.
      // Zakładamy, że po 1 sekundzie wszystkie obliczenia (które są synchroniczne, ale ukryte) się zakończą.
      // To jest słaby punkt tego rozwiązania, ale wymuszony przez strukturę biblioteki.
      setTimeout(() => {
        if (chart.personality) {
          resolve();
        } else {
          reject(new Error("Nie udało się obliczyć bodygraphu. Sprawdź format daty i godziny."));
        }
      }, 1000);
    });

    // Mapowanie wyników do struktury, której oczekuje frontend
    const fullProfile = {
      type: chart.type,
      profile: chart.profile,
      authority: chart.authority,
      definition: chart.definition,
      channels: Object.keys(chart.channels),
      gates: Object.keys(chart.gates),
      centers: chart.centers,
    };

    return new Response(JSON.stringify(fullProfile), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Błąd w funkcji calculate-human-design:", error);
    const errorMessage = error instanceof Error ? error.message : "Wystąpił nieznany błąd.";
    const errorStack = error instanceof Error ? error.stack : "Brak śladu stosu.";
    
    return new Response(JSON.stringify({ 
      error: "Błąd po stronie serwera.",
      details: errorMessage,
      stack: errorStack
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

export const config: Config = {
  path: "/api/calculate-human-design",
  method: ["POST", "OPTIONS"],
  cache: "manual"
};
