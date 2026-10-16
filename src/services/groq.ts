import { Platform } from 'react-native';

/**
 * Groq API Service
 *
 * Handles API key verification and interaction with Groq AI endpoints:
 * - Model authentication check: https://api.groq.com/openai/v1/models
 * - Whisper Speech-to-Text: https://api.groq.com/openai/v1/audio/transcriptions
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

/**
 * Validates a Groq API key by querying the Groq models endpoint.
 *
 * @param apiKey - Groq API key string to validate
 * @returns Object with validation status and localized error message if invalid
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
 *
 * @param audioUri - URI of the recorded audio file (blob: or local file://)
 * @param apiKey - Valid Groq API key
 * @returns Result object containing the transcribed Polish text or error message
 */
export async function transcribeAudioWithGroq(
  audioUri: string,
  apiKey: string
): Promise<TranscriptionResult> {
  const trimmedKey = apiKey.trim();

  // Support mock test key for local development
  if (trimmedKey === 'gsk_test_mock_valid_key_for_testing_12345') {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      success: true,
      text: 'Od wczoraj mam podwyższoną temperaturę do 38 stopni, ból głowy i katar. Nie mam trudności z oddychaniem ani bólu w klatce piersiowej.',
    };
  }

  const formData = new FormData();

  try {
    if (Platform.OS === 'web') {
      // In web browser environment, fetch blob from object URL
      const audioResponse = await fetch(audioUri);
      const audioBlob = await audioResponse.blob();
      formData.append('file', audioBlob, 'audio.webm');
    } else {
      // In native React Native environment, supply file descriptor object
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
