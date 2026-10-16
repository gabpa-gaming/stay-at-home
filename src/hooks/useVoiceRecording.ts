import { useState, useRef, useEffect, useCallback } from 'react';
import {
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import { transcribeAudioWithGroq } from '../services/groq';

interface UseVoiceRecordingProps {
  apiKey: string | null;
  onTranscriptReady?: (transcript: string) => void;
}

export function useVoiceRecording({ apiKey, onTranscriptReady }: UseVoiceRecordingProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [silenceDetected, setSilenceDetected] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Configure high quality recording with metering enabled
  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  // Poll status every 75ms for responsive real-time volume reaction
  const recorderState = useAudioRecorderState(recorder, 75);

  const startTimeRef = useRef<number>(0);
  const lastSpokenAtRef = useRef<number>(0);
  const isStoppingRef = useRef<boolean>(false);
  const isRecordingRef = useRef<boolean>(false);

  // Normalize metering (-160 to 0 dBFS) to 0.0 - 1.0 volume
  const rawMetering = recorderState.metering;
  let currentVolume = 0;
  if (isRecording && rawMetering !== undefined) {
    const clamped = Math.max(-60, Math.min(-5, rawMetering));
    currentVolume = Math.min(1, Math.max(0, (clamped + 60) / 55));
  }

  // Keep isRecordingRef in sync
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Stop recording and trigger speech-to-text transcription
  const stopRecording = useCallback(async () => {
    if (isStoppingRef.current || !isRecordingRef.current) return;
    isStoppingRef.current = true;
    setIsRecording(false);
    setSilenceDetected(false);

    try {
      await recorder.stop();
      const recordedUri = recorder.uri;

      if (!recordedUri) {
        setRecordingError('Nie udało się zapisać nagrania dźwiękowego.');
        isStoppingRef.current = false;
        return;
      }

      if (!apiKey) {
        setRecordingError('Brak aktywnego klucza Groq do wykonania transkrypcji.');
        isStoppingRef.current = false;
        return;
      }

      setIsTranscribing(true);
      setRecordingError(null);

      const result = await transcribeAudioWithGroq(recordedUri, apiKey);

      setIsTranscribing(false);
      isStoppingRef.current = false;

      if (result.success && result.text) {
        setTranscript(result.text);
        onTranscriptReady?.(result.text);
      } else {
        setRecordingError(result.error || 'Nie udało się przetranskrybować nagrania.');
      }
    } catch (err: unknown) {
      setIsTranscribing(false);
      isStoppingRef.current = false;
      setRecordingError('Wystąpił nieoczekiwany błąd podczas zatrzymywania nagrywania.');
      console.error('Stop recording error:', err);
    }
  }, [recorder, apiKey, onTranscriptReady]);

  // Start recording
  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing) return;
    setRecordingError(null);

    try {
      // 1. Request microphone permission
      const { granted } = await requestRecordingPermissionsAsync();
      if (!granted) {
        setRecordingError('Wymagany jest dostęp do mikrofonu, aby opisać objawy głosem.');
        return;
      }

      // 2. Configure audio mode
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // 3. Prepare and start recording
      await recorder.prepareToRecordAsync();
      recorder.record();

      const now = Date.now();
      startTimeRef.current = now;
      lastSpokenAtRef.current = now;
      isStoppingRef.current = false;
      setIsRecording(true);
      setSilenceDetected(false);
    } catch (err: unknown) {
      setIsRecording(false);
      setRecordingError('Nie udało się uruchomić mikrofonu. Spróbuj ponownie.');
      console.error('Start recording error:', err);
    }
  }, [isRecording, isTranscribing, recorder]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Silence detection logic:
  // When recording is active, if silence persists for 3.0 seconds (after grace period), auto-stop
  useEffect(() => {
    if (!isRecording) return;

    const SILENCE_THRESHOLD_VOLUME = 0.14; // below ~ -52 dBFS
    const SILENCE_LIMIT_MS = 3000;         // 3 seconds of continuous silence
    const GRACE_PERIOD_MS = 1800;          // 1.8 seconds initial grace period

    const timer = setInterval(() => {
      const now = Date.now();
      const totalElapsed = now - startTimeRef.current;

      if (currentVolume >= SILENCE_THRESHOLD_VOLUME) {
        // Voice is detected, reset silence timer
        lastSpokenAtRef.current = now;
        setSilenceDetected(false);
      } else {
        // Silence detected
        const silenceElapsed = now - lastSpokenAtRef.current;

        if (totalElapsed > GRACE_PERIOD_MS) {
          if (silenceElapsed > 1400) {
            setSilenceDetected(true);
          }
          if (silenceElapsed >= SILENCE_LIMIT_MS) {
            clearInterval(timer);
            stopRecording();
          }
        }
      }
    }, 150);

    return () => clearInterval(timer);
  }, [isRecording, currentVolume, stopRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript(null);
  }, []);

  return {
    isRecording,
    isTranscribing,
    volume: currentVolume,
    silenceDetected,
    transcript,
    recordingError,
    startRecording,
    stopRecording,
    toggleRecording,
    clearTranscript,
  };
}
