import { Platform } from 'react-native';
import {
  MASTER_TRIAGE_PROMPT,
  TriageCategory,
  TriageModelOutput,
} from '../prompts/triageConfig';

/**
 * Groq API Service
 *
 * Handles API key verification and interaction with Groq AI endpoints:
 * - Model authentication check: https://api.groq.com/openai/v1/models
 * - Whisper Speech-to-Text: https://api.groq.com/openai/v1/audio/transcriptions
 * - Reasoning Triage Model: https://api.groq.com/openai/v1/chat/completions
 */

export interface ApiKeyValidationResult {
  isValid: boolean;
  error?: string;
}

export interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
}

export interface TriageAnalysisResult {
  success: boolean;
  data?: TriageModelOutput;
  error?: string;
}

/**
 * Validates a Groq API key by querying the Groq models endpoint.
 */
export async function validateGroqApiKey(apiKey: string): Promise<ApiKeyValidationResult> {
  const trimmedKey = apiKey.trim();

  if (!trimmedKey) {
    return {
      isValid: false,
      error: 'Wprowadź klucz API Groq.',
    };
  }

  // Pre-validation: Groq API keys follow the 'gsk_' prefix convention
  if (!trimmedKey.startsWith('gsk_')) {
    return {
      isValid: false,
      error: 'Nieprawidłowy format. Prawidłowy klucz Groq zaczyna się od „gsk_”.',
    };
  }

  if (trimmedKey.length < 20) {
    return {
      isValid: false,
      error: 'Klucz API jest zbyt krótki. Sprawdź, czy został skopiowany w całości.',
    };
  }

  // Allow designated mock key for local offline testing if needed
  if (trimmedKey === 'gsk_test_mock_valid_key_for_testing_12345') {
    return { isValid: true };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${trimmedKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return { isValid: true };
    }

    if (response.status === 401) {
      return {
        isValid: false,
        error: 'Nieprawidłowy klucz API (401 Unauthorized). Upewnij się, że klucz jest aktywny w konsoli Groq.',
      };
    }

    if (response.status === 429) {
      return {
        isValid: false,
        error: 'Przekroczono limit zapytań (429 Rate Limit) dla tego klucza Groq.',
      };
    }

    return {
      isValid: false,
      error: `Błąd serwera Groq (kod ${response.status}). Spróbuj ponownie za chwilę.`,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return {
        isValid: false,
        error: 'Przekroczono czas oczekiwania (10s). Sprawdź połączenie z internetem.',
      };
    }

    return {
      isValid: false,
      error: 'Błąd połączenia sieciowego. Nie udało się połączyć z serwerem Groq.',
    };
  }
}

/**
 * Sends an audio recording to Groq Whisper for speech-to-text transcription.
 */
export async function transcribeAudioWithGroq(
  audioUri: string,
  apiKey: string
): Promise<TranscriptionResult> {
  const trimmedKey = apiKey.trim();

  // Support mock test key for local development
  if (trimmedKey === 'gsk_test_mock_valid_key_for_testing_12345') {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return {
      success: true,
      text: 'Od wczoraj mam gorączkę 38.3 stopnia, ból gardła i osłabienie. Nie mam duszności ani bólu w klatce piersiowej.',
    };
  }

  const formData = new FormData();

  try {
    if (Platform.OS === 'web') {
      const audioResponse = await fetch(audioUri);
      const audioBlob = await audioResponse.blob();
      formData.append('file', audioBlob, 'audio.webm');
    } else {
      // @ts-expect-error React Native accepts file descriptor object in FormData
      formData.append('file', {
        uri: audioUri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      });
    }

    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'pl');
    formData.append('response_format', 'json');
    formData.append('temperature', '0');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${trimmedKey}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      const detail = errorJson?.error?.message || `Błąd serwera (${response.status})`;
      return {
        success: false,
        error: `Nie udało się przetranskrybować nagrania: ${detail}`,
      };
    }

    const data = await response.json();
    const transcribedText = (data.text || '').trim();

    if (!transcribedText) {
      return {
        success: false,
        error: 'Nie wykryto zrozumiałej mowy w nagraniu. Spróbuj opisać objawy ponownie.',
      };
    }

    return {
      success: true,
      text: transcribedText,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        error: 'Przekroczono czas oczekiwania na transkrypcję. Sprawdź połączenie.',
      };
    }
    return {
      success: false,
      error: 'Błąd podczas przesyłania nagrania do serwisu transkrypcji.',
    };
  }
}

/**
 * Helper to parse and normalize JSON output from the Groq reasoning model
 */
function parseTriageJson(rawContent: string): TriageModelOutput | null {
  // Strip out reasoning thought chains if present in content
  const cleaned = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  let parsed: unknown = null;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }

  if (!parsed || typeof parsed !== 'object') return null;

  const candidate = parsed as Record<string, unknown>;

  // Normalize category
  let category: TriageCategory = 'out_of_scope';
  const rawCat = String(candidate.category || '').toLowerCase().trim();

  if (rawCat === 'emergency' || rawCat.includes('szpital') || rawCat.includes('zagrozenie')) {
    category = 'emergency';
  } else if (
    rawCat === 'stay_at_home_and_consult' ||
    rawCat === 'stay_at_home' ||
    rawCat.includes('domu')
  ) {
    category = 'stay_at_home_and_consult';
  } else if (rawCat === 'consult_doctor' || rawCat.includes('lekarz')) {
    category = 'consult_doctor';
  } else if (rawCat === 'can_work' || rawCat.includes('pracy')) {
    category = 'can_work';
  } else if (rawCat === 'out_of_scope' || rawCat.includes('scope')) {
    category = 'out_of_scope';
  }

  const symptoms = Array.isArray(candidate.symptoms)
    ? candidate.symptoms.map((s) => String(s).trim()).filter(Boolean)
    : [];

  const reasoning = typeof candidate.reasoning === 'string'
    ? candidate.reasoning.trim()
    : 'Brak szczegółowego uzasadnienia.';

  return {
    symptoms,
    reasoning,
    category,
  };
}

/**
 * Analyzes patient symptom transcript with a Groq reasoning model.
 * Output format: { "symptoms": [], "reasoning": "", "category": "" }
 */
export async function analyzeSymptomsWithGroq(
  transcript: string,
  apiKey: string
): Promise<TriageAnalysisResult> {
  const trimmedKey = apiKey.trim();
  const trimmedTranscript = transcript.trim();

  if (!trimmedTranscript) {
    return {
      success: true,
      data: {
        symptoms: [],
        reasoning: 'Nagranie nie zawierało opisu objawów chorobowych.',
        category: 'out_of_scope',
      },
    };
  }

  // Handle mock key for offline and fast testing
  if (trimmedKey === 'gsk_test_mock_valid_key_for_testing_12345') {
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const lower = trimmedTranscript.toLowerCase();
    if (
      lower.includes('klatce') ||
      lower.includes('duszno') ||
      lower.includes('oddycha') ||
      lower.includes('przytomn') ||
      lower.includes('zawał')
    ) {
      return {
        success: true,
        data: {
          symptoms: ['duszność', 'ból w klatce piersiowej'],
          reasoning:
            'Zgłoszono objawy kardiologiczno-oddechowe wysokiego ryzyka. Wymagana natychmiastowa interwencja Zespołu Ratownictwa Medycznego.',
          category: 'emergency',
        },
      };
    }

    if (
      lower.includes('gorączk') ||
      lower.includes('temperatur') ||
      lower.includes('gardł') ||
      lower.includes('katar') ||
      lower.includes('wymiot') ||
      lower.includes('biegunk')
    ) {
      return {
        success: true,
        data: {
          symptoms: ['podwyższona temperatura ciała (38.3°C)', 'ból gardła', 'ogólne osłabienie'],
          reasoning:
            'Obraz kliniczny odpowiada ostrej infekcji wirusowej dróg oddechowych. Wskazane pozostanie w domu w celu regeneracji i zapobiegania rozprzestrzenianiu patogenów oraz odbycie teleporady lekarskiej.',
          category: 'stay_at_home_and_consult',
        },
      };
    }

    if (lower.includes('plec') || lower.includes('staw') || lower.includes('wysypk') || lower.includes('brzuch')) {
      return {
        success: true,
        data: {
          symptoms: ['bóle miejscowe o umiarkowanym nasileniu'],
          reasoning:
            'Dolegliwości wymagają planowej diagnostyki u lekarza pierwszego kontaktu, bez cech ostrej infekcji zakaźnej.',
          category: 'consult_doctor',
        },
      };
    }

    if (lower.includes('pogoda') || lower.includes('cześć') || lower.includes('test') || lower.length < 10) {
      return {
        success: true,
        data: {
          symptoms: [],
          reasoning: 'Wypowiedź nie odnosi się do stanu zdrowia ani objawów chorobowych.',
          category: 'out_of_scope',
        },
      };
    }

    return {
      success: true,
      data: {
        symptoms: ['lekkie zmęczenie'],
        reasoning:
          'Brak cech ostrej infekcji ani zaburzeń funkcjonowania. Pacjent może bezpiecznie kontynuować aktywność zawodową.',
        category: 'can_work',
      },
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 28000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${trimmedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: MASTER_TRIAGE_PROMPT },
          { role: 'user', content: `Wypowiedź pacjenta: "${trimmedTranscript}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const fallbackResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${trimmedKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'minimaxai/minimax-m2.7',
          messages: [
            { role: 'system', content: MASTER_TRIAGE_PROMPT },
            { role: 'user', content: `Wypowiedź pacjenta: "${trimmedTranscript}"` },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (!fallbackResponse.ok) {
        const errorJson = await fallbackResponse.json().catch(() => null);
        return {
          success: false,
          error: errorJson?.error?.message || `Błąd analizy objawów (${fallbackResponse.status})`,
        };
      }

      const fallbackData = await fallbackResponse.json();
      const rawContent = fallbackData.choices?.[0]?.message?.content || '';
      const parsedOutput = parseTriageJson(rawContent);

      if (!parsedOutput) {
        return {
          success: false,
          error: 'Model AI zwrócił nieobsługiwany format danych analizy.',
        };
      }

      return {
        success: true,
        data: parsedOutput,
      };
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    const parsedOutput = parseTriageJson(rawContent);

    if (!parsedOutput) {
      return {
        success: false,
        error: 'Nie udało się przetworzyć struktury odpowiedzi modelu wnioskującego.',
      };
    }

    return {
      success: true,
      data: parsedOutput,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        error: 'Przekroczono limit czasu analizy wnioskującej AI. Spróbuj ponownie.',
      };
    }
    return {
      success: false,
      error: 'Wystąpił problem z połączeniem podczas analizy objawów.',
    };
  }
}
