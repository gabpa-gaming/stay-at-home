/**
 * Medical Pre-screening Triage Configuration
 *
 * Contains master system prompt, symptom reaction rules,
 * and category visual definitions for the Groq reasoning model.
 */

export type TriageCategory =
  | 'can_work'                 // Green: Pacjent może pójść do pracy
  | 'consult_doctor'           // Yellow: Zalecana rozmowa z lekarzem
  | 'stay_at_home_and_consult' // Orange: Zostań w domu + zalecana rozmowa z lekarzem
  | 'emergency'                // Red: Zagrożenie życia - Natychmiast idź do szpitala
  | 'out_of_scope';            // Gray: Out of scope

export interface TriageModelOutput {
  symptoms: string[];
  reasoning: string;
  category: TriageCategory;
}

/**
 * Master system prompt instructed for clinical triage reasoning.
 * Enforces JSON output schema: { "symptoms": [], "reasoning": "", "category": "" }.
 */
export const MASTER_TRIAGE_PROMPT = `Jesteś certyfikowanym asystentem medycznym AI w systemie wstępnej weryfikacji zdrowotnej (triage medyczny).
Twoim zadaniem jest przeanalizowanie zarejestrowanego głosem opisu objawów pacjenta i przydzielenie go do jednej z 5 precyzyjnych kategorii.

KATEGORIE TRIAGE (wybierz dokładnie jedną wartość pola "category"):

1. "emergency" (Czerwony - Zagrożenie życia):
   - Objawy alarmowe wymagające natychmiastowego wezwania pogotowia ratunkowego (112/999) lub wizyty na SOR.
   - Przykłady: ból lub ucisk w klatce piersiowej promieniujący do żuchwy/ręki, duszność spoczynkowa, nagły silny ból głowy (piorunujący), asymetria twarzy, niedowład kończyny, zaburzenia mowy, utrata przytomności, drgawki, masywne krwawienie, ostre reakcje anafilaktyczne.

2. "stay_at_home_and_consult" (Pomarańczowy - Zostań w domu + zalecana rozmowa z lekarzem):
   - Objawy ostrej infekcji (potencjalnie zakaźnej), gorączka (>38°C), wymioty, ostra biegunka, silne osłabienie uniemożliwiające bezpieczne funkcjonowanie w pracy i stwarzające ryzyko zarażenia innych.
   - Pacjent bezwzględnie powinien pozostać w domu i odbyć teleporadę lub konsultację lekarską.

3. "consult_doctor" (Żółty - Zalecana rozmowa z lekarzem):
   - Dolegliwości umiarkowane, przewlekłe lub wymagające diagnozy medycznej, ale bez objawów ostrej infekcji zakaźnej i bez zagrożenia życia (np. utrzymujący się kaszel bez gorączki, łagodny ból pleców/stawu, wysypka, dolegliwości dyspeptyczne).
   - Wskazana planowa konsultacja z lekarzem rodzinnym lub specjalistą.

4. "can_work" (Zielony - Pacjent może pójść do pracy):
   - Łagodne, izolowane dolegliwości nieinfekcyjne (np. zmęczenie po nieprzespanej nocy, zakwasy po treningu, łagodne napięcie mięśniowe), brak gorączki, brak objawów zakaźnych, dobre samopoczucie ogólne.
   - Brak przeciwwskazań do wykonywania codziennych obowiązków zawodowych.

5. "out_of_scope" (Szary - Out of scope):
   - Wypowiedź nie zawiera żadnych medycznych objawów ani dolegliwości zdrowotnych (np. test mikrofonu, powitanie, pytania o pogodę, bełkot, cisza, wypowiedzi o polityce lub zakupach).

ZASADY ODPOWIEDZI:
- Wyodrębnij konkretne objawy do tablicy "symptoms" (w języku polskim).
- W polu "reasoning" uzasadnij zwięźle i profesjonalnie po polsku swój tok rozumowania medycznego (2-3 zdania). Pole reasoning powinno mieć tylko informacje dla użytkownika/pacjenta
- Zwróć WYŁĄCZNIE poprawny dokument JSON bez znaczników markdown, bez zbędnych słów.

FORMAT JSON:
{
  "symptoms": ["objaw 1", "objaw 2"],
  "reasoning": "Krótkie uzasadnienie kliniczne...",
  "category": "can_work" | "consult_doctor" | "stay_at_home_and_consult" | "emergency" | "out_of_scope"
}`;

/**
 * Detailed configuration for each category:
 * Visual colors, badge labels, clinical actions, and patient guidance.
 */
export const CATEGORY_CONFIG: Record<
  TriageCategory,
  {
    title: string;
    badgeLabel: string;
    actionAdvice: string;
    color: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    iconType: 'check' | 'alert-circle' | 'home-alert' | 'emergency-cross' | 'help-circle';
    emergencyNotice?: string;
  }
> = {
  can_work: {
    title: 'Pacjent może pójść do pracy',
    badgeLabel: 'Status: Zdolny do pracy',
    actionAdvice:
      'Zgłoszone dolegliwości są łagodne i nie wskazują na ostrą chorobę zakaźną ani stan wymagający zwolnienia. Obserwuj organizm i zadbaj o regenerację.',
    color: '#16A34A',           // Vibrant medical green
    backgroundColor: '#F0FDF4', // Light green tint
    borderColor: '#86EFAC',     // Thin green outline
    textColor: '#14532D',       // Dark green text
    iconType: 'check',
  },
  consult_doctor: {
    title: 'Zalecana rozmowa z lekarzem',
    badgeLabel: 'Wskazana konsultacja',
    actionAdvice:
      'Twoje objawy wymagają profesjonalnej oceny medycznej. Skontaktuj się ze swoim lekarzem rodzinnym lub umów teleporadę w celu ustalenia planu leczenia.',
    color: '#EAB308',           // Warm amber / yellow
    backgroundColor: '#FEFCE8', // Light yellow tint
    borderColor: '#FDE047',     // Thin yellow outline
    textColor: '#854D0E',       // Dark yellow/brown text
    iconType: 'alert-circle',
  },
  stay_at_home_and_consult: {
    title: 'Zostań w domu + zalecana rozmowa z lekarzem',
    badgeLabel: 'Zalecana izolacja domowa',
    actionAdvice:
      'Objawy wskazują na infekcję lub osłabienie wymagające odpoczynku. Pozostań w domu, aby nie obciążać organizmu i nie narażać innych, oraz skonsultuj się z lekarzem.',
    color: '#EA580C',           // Warm orange
    backgroundColor: '#FFF7ED', // Light orange tint
    borderColor: '#FDBA74',     // Thin orange outline
    textColor: '#9A3412',       // Dark orange text
    iconType: 'home-alert',
  },
  emergency: {
    title: 'Zagrożenie życia – Natychmiast idź do szpitala',
    badgeLabel: 'Stan nagły (112 / 999)',
    actionAdvice:
      'Opisane objawy mogą wskazywać na bezpośrednie zagrożenie zdrowia lub życia. Natychmiast wezwij Zespół Ratownictwa Medycznego (112 lub 999) lub udaj się na Szpitalny Oddział Ratunkowy (SOR).',
    color: '#DC2626',           // Urgent crimson red
    backgroundColor: '#FEF2F2', // Light red tint
    borderColor: '#FCA5A5',     // Thin red outline
    textColor: '#991B1B',       // Dark red text
    iconType: 'emergency-cross',
    emergencyNotice: 'Nie czekaj na rozwój objawów. Zadzwoń pod numer 112 natychmiast.',
  },
  out_of_scope: {
    title: 'Poza zakresem usługi (Out of scope)',
    badgeLabel: 'Nierozpoznano objawów',
    actionAdvice:
      'W nagranej wypowiedzi nie zidentyfikowano jednoznacznych objawów medycznych. Upewnij się, że mikrofon wyraźnie rejestruje Twój głos i opisz samopoczucie ponownie.',
    color: '#64748B',           // Cold gray
    backgroundColor: '#F8FAFC', // Slate 50
    borderColor: '#CBD5E1',     // Thin cold gray outline
    textColor: '#334155',       // Dark cold slate
    iconType: 'help-circle',
  },
};

/**
 * Pre-defined clinical symptom reaction mappings
 * Used for fast lookup, reassurance tips, and context enrichment.
 */
export const SYMPTOM_REACTIONS = {
  fever: {
    label: 'Gorączka / Podwyższona temperatura',
    rule: 'Temperatura powyżej 38°C kwalifikuje do pozostania w domu i nawadniania.',
  },
  chestPain: {
    label: 'Ból lub ucisk w klatce piersiowej',
    rule: 'Bezwzględny sygnał alarmowy wymagający natychmiastowej interwencji pogotowia.',
  },
  dyspnea: {
    label: 'Duszność / Problemy z oddychaniem',
    rule: 'Symptom wysokiego ryzyka oddechowo-krążeniowego.',
  },
  soreThroat: {
    label: 'Ból gardła / Infekcja górnych dróg oddechowych',
    rule: 'Wymaga oceny pod kątem podłoża wirusowego lub bakteryjnego.',
  },
  mildFatigue: {
    label: 'Przemęczenie / Senność',
    rule: 'Jeśli bez gorączki i cech infekcji, zwykle dopuszcza aktywność zawodową.',
  },
} as const;
