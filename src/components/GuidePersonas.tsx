import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";

const guides = [
  {
    name: "Luna - Przewodniczka Intuicji",
    role: "Mistrzyni Ryb i Empatii",
    avatar: "🌙",
    color: "cosmic-purple",
    specialty: "Rozwój intuicji, zrozumienie emocji, praca z marzeniami",
    description: "Luna pomoże Ci zrozumieć Twoją rybią naturę i nauczy, jak wykorzystać intuicję jako kompas życiowy.",
    approach: "Delikatna, empatyczna, prowadzi przez wizualizacje i medytacje"
  },
  {
    name: "Stellaris - Mistrz Liczb",
    role: "Przewodnik Numerologii 33",
    avatar: "✨",
    color: "cosmic-gold",
    specialty: "Zrozumienie misji życiowej, rozwój duchowy, służba innym",
    description: "Stellaris pomoże Ci zrozumieć potęgę Liczby Mistrzowskiej 33 i jak wcielić ją w życie.",
    approach: "Mądry, duchowy, uczy przez praktyczne ćwiczenia i refleksje"
  },
  {
    name: "Chen - Harmonizator Energii", 
    role: "Mistrz Chińskiej Mądrości",
    avatar: "🐲",
    color: "cosmic-teal",
    specialty: "Równowaga lojalności i niezależności, praca z energią zwierząt",
    description: "Chen nauczy Cię, jak połączyć lojalność Psa z łagodnością Kozy w harmonijną całość.",
    approach: "Spokojny, praktyczny, uczy przez życiowe przykłady i ćwiczenia energetyczne"
  },
  {
    name: "Phoenix - Architekt Życia",
    role: "Przewodnik Human Design",
    avatar: "🔥",
    color: "cosmic-pink", 
    specialty: "Strategia życiowa, podejmowanie decyzji, autorytet witalny",
    description: "Phoenix pomoże Ci zrozumieć Twoją unikalną strategię i nauczy słuchania autorytetu brzucha.",
    approach: "Dynamiczny, praktyczny, koncentruje się na eksperymentach życiowych"
  },
  {
    name: "Itzamna - Starożytny Mędrzec",
    role: "Strażnik Majańskiej Mądrości",
    avatar: "🏛️",
    color: "cosmic-blue",
    specialty: "Cykle życiowe, transformacja, starożytna mądrość",
    description: "Itzamna połączy dla Ciebie mądrość Gwiazdy i Wojownika, prowadząc przez cykle transformacji.",
    approach: "Głęboki, mistyczny, używa symboli i rytualnych praktyk"
  }
];

export function GuidePersonas() {
  const [selectedGuide, setSelectedGuide] = useState(0);

  const createMetaPrompt = () => {
    const allData = `
KONTEKST ASTROLOGICZNY:
- Słońce w Rybach: Empatia, intuicja, kreatywność, wrażliwość
- Ascendent w Rybach: Marzycielskość, tajemniczość, adaptacyjność

NUMEROLOGIA:
- Liczba Mistrzowska 33: Chrystusowe mistrzostwo, służba uniwersalna, przewodnik duchowy

HOROSKOP CHIŃSKI:
- Pies (roczny): Lojalność, uczciwość, niezawodność
- Koza (godzinowa): Bezinteresowność, łagodność, wytrwałość

HUMAN DESIGN:
- Generator Manifestujący: Budowniczy z dużą energią życiową
- Autorytet Witalny: Decyzje podejmowane "brzuchem"
- Profil 6/2: Wzorzec/Pustelnik - wzór do naśladowania

KALENDARZ MAJÓW:
- 4 Żółta Gwiazda: Harmonia, uzdrowienie, autentyczność
- 4 Żółty Wojownik: Wolność, odwaga, mistyczna inteligencja

INSTRUKCJA DLA AI:
Jesteś ekspertką od systemów duchowo-rozwojowych. Na podstawie powyższego profilu astrologiczno-numerologicznego:

1. Analizuj wzorce i połączenia między systemami
2. Oferuj praktyczne wskazówki rozwojowe
3. Pomagaj w zrozumieniu wyzwań i talentów
4. Prowadź dialog dostosowany do aktualnych potrzeb
5. Łącz różne systemy w spójną całość
6. Zachowuj empatyczne, wspierające podejście

Prowadź rozmowę jak doświadczony mentor duchowy, który rozumie złożoność ludzkiej natury i potrafi połączyć różne tradycje mądrości.
    `;

    return allData;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">🧭 Przewodnicy Duchowi</h2>
        <CopyButton text={createMetaPrompt()} label="Meta-prompt" />
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {guides.map((guide, index) => (
          <Button
            key={index}
            variant={selectedGuide === index ? "default" : "outline"}
            onClick={() => setSelectedGuide(index)}
            className={`h-16 flex flex-col items-center justify-center gap-1 ${
              selectedGuide === index 
                ? `bg-${guide.color}/20 border-${guide.color}/30` 
                : "bg-muted/10"
            }`}
          >
            <span className="text-2xl">{guide.avatar}</span>
            <span className="text-xs text-center leading-tight">{guide.name.split(' ')[0]}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-4 p-4 rounded-lg bg-background/20 backdrop-blur-sm border border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{guides[selectedGuide].avatar}</span>
            <div>
              <h3 className="text-xl font-bold text-foreground">{guides[selectedGuide].name}</h3>
              <p className={`text-sm text-${guides[selectedGuide].color}`}>{guides[selectedGuide].role}</p>
            </div>
          </div>
          <CopyButton 
            text={`${guides[selectedGuide].name}: ${guides[selectedGuide].description}`} 
            label="Przewodnik" 
          />
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {guides[selectedGuide].description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-primary">Specjalność:</h4>
          <p className="text-sm text-muted-foreground">{guides[selectedGuide].specialty}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-secondary">Podejście:</h4>
          <p className="text-sm text-muted-foreground">{guides[selectedGuide].approach}</p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="secondary" className={`bg-${guides[selectedGuide].color}/20 text-${guides[selectedGuide].color}`}>
            Przewodnik
          </Badge>
          <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
            Mentor
          </Badge>
          <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">
            Eksperta
          </Badge>
        </div>
      </div>
    </div>
  );
}