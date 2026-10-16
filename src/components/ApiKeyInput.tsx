import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme/theme';
import { validateGroqApiKey } from '../services/groq';
import { useVoiceRecording } from '../hooks/useVoiceRecording';
import { VoiceButton } from './VoiceButton';
import { TranscriptCard } from './TranscriptCard';

interface ApiKeyInputProps {
  onKeyValidated?: (apiKey: string) => void;
  onTranscriptReady?: (transcript: string) => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Inner component active once a valid Groq API key is present.
 * Connects the microphone with real-time volume reaction,
 * automatic silence detection auto-stop, and temporary speech-to-text display.
 */
const ActiveVoiceSection: React.FC<{
  apiKey: string;
  onResetKey: () => void;
  onTranscriptReady?: (transcript: string) => void;
}> = ({ apiKey, onResetKey, onTranscriptReady }) => {
  const {
    isRecording,
    isTranscribing,
    volume,
    silenceDetected,
    transcript,
    recordingError,
    toggleRecording,
    clearTranscript,
  } = useVoiceRecording({
    apiKey,
    onTranscriptReady,
  });

  return (
    <View style={styles.validatedContainer}>
      {/* Active Key Status Chip */}
      <View style={styles.activeKeyChip}>
        <View style={styles.greenCheckDot} />
        <Text style={styles.activeKeyText}>
          Groq Whisper aktywny ({apiKey.slice(0, 4)}...{apiKey.slice(-4)})
        </Text>
        <Pressable
          onPress={onResetKey}
          disabled={isRecording || isTranscribing}
          accessibilityRole="button"
          accessibilityLabel="Zmień klucz API"
          style={({ pressed }) => [
            styles.changeKeyBtn,
            (isRecording || isTranscribing) && styles.btnDisabled,
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.changeKeyText}>Zmień</Text>
        </Pressable>
      </View>

      {/* Microphone Component (reacts to volume & silence) */}
      <VoiceButton
        onPress={toggleRecording}
        isRecording={isRecording}
        isTranscribing={isTranscribing}
        volume={volume}
        silenceDetected={silenceDetected}
      />

      {/* Temporary Speech-to-Text Transcript Display */}
      {transcript && (
        <TranscriptCard
          transcript={transcript}
          onDismiss={clearTranscript}
          autoHideDurationSeconds={14}
        />
      )}

      {/* Recording or Transcription Error Message */}
      {recordingError && (
        <View style={styles.recordingErrorBox}>
          <View style={styles.errorDot} />
          <Text style={styles.recordingErrorText}>{recordingError}</Text>
        </View>
      )}
    </View>
  );
};

/**
 * GroqApiKeyInput Component
 *
 * Provides a secure, clinical input field for the Groq Whisper API key.
 * Validates the key against the Groq API.
 * Upon successful validation, replaces the input field with the active microphone.
 */
export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  onKeyValidated,
  onTranscriptReady,
  style,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validatedKey, setValidatedKey] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSecure, setIsSecure] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const handleValidate = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setErrorMessage('Wprowadź swój klucz API Groq.');
      return;
    }

    setIsValidating(true);
    setErrorMessage(null);

    const result = await validateGroqApiKey(trimmed);

    setIsValidating(false);

    if (result.isValid) {
      setValidatedKey(trimmed);
      setErrorMessage(null);
      onKeyValidated?.(trimmed);
    } else {
      setErrorMessage(result.error || 'Nie udało się zweryfikować klucza API.');
    }
  };

  const handleResetKey = () => {
    setValidatedKey(null);
    setErrorMessage(null);
  };

  // If key is validated, display the active microphone & speech-to-text view
  if (validatedKey) {
    return (
      <View style={[{ width: '100%' }, style]}>
        <ActiveVoiceSection
          apiKey={validatedKey}
          onResetKey={handleResetKey}
          onTranscriptReady={onTranscriptReady}
        />
      </View>
    );
  }

  // Otherwise, render the key input field card
  return (
    <View style={[styles.card, style]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.keyIconContainer}>
          <View style={styles.keyHead} />
          <View style={styles.keyStem} />
          <View style={styles.keyTooth1} />
          <View style={styles.keyTooth2} />
        </View>
        <View style={styles.headerTitles}>
          <Text style={styles.title}>Autoryzacja Groq Whisper</Text>
          <Text style={styles.subtitle}>Klucz API wymagany do transkrypcji mowy</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        Aby opisać objawy głosem, podaj swój klucz API Groq. Aplikacja sprawdzi jego poprawność przed uruchomieniem mikrofonu.
      </Text>

      {/* Input Field Container */}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          errorMessage ? styles.inputWrapperError : null,
        ]}
      >
        <TextInput
          value={apiKey}
          onChangeText={(text) => {
            setApiKey(text);
            if (errorMessage) setErrorMessage(null);
          }}
          placeholder="gsk_..."
          placeholderTextColor={theme.colors.coldGray[400]}
          secureTextEntry={isSecure}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!isValidating}
          style={styles.textInput}
          accessibilityLabel="Pole klucza API Groq"
        />

        {/* Toggle Visibility Button */}
        {apiKey.length > 0 && (
          <Pressable
            onPress={() => setIsSecure(!isSecure)}
            accessibilityRole="button"
            accessibilityLabel={isSecure ? 'Pokaż klucz' : 'Ukryj klucz'}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleBtnText}>{isSecure ? 'Pokaż' : 'Ukryj'}</Text>
          </Pressable>
        )}
      </View>

      {/* Error Message Box */}
      {errorMessage && (
        <View style={styles.errorBox}>
          <View style={styles.errorDot} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* Verification Submit Button */}
      <Pressable
        onPress={handleValidate}
        disabled={isValidating || apiKey.trim().length === 0}
        accessibilityRole="button"
        accessibilityLabel="Zweryfikuj i aktywuj mikrofon"
        style={({ pressed }) => [
          styles.submitBtn,
          (apiKey.trim().length === 0 || isValidating) && styles.submitBtnDisabled,
          pressed && styles.submitBtnPressed,
        ]}
      >
        {isValidating ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={theme.colors.white} />
            <Text style={styles.submitBtnText}>Weryfikacja klucza w Groq...</Text>
          </View>
        ) : (
          <Text style={styles.submitBtnText}>Zweryfikuj i aktywuj mikrofon</Text>
        )}
      </Pressable>

      {/* Privacy Notice */}
      <View style={styles.privacyNote}>
        <View style={styles.privacyDot} />
        <Text style={styles.privacyText}>
          Klucz API jest przechowywany wyłącznie w pamięci bieżącej sesji urządzenia.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.geometry.radii.lg,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    padding: theme.geometry.spacing[16],
    marginVertical: theme.geometry.spacing[16],
  },
  validatedContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeKeyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.geometry.spacing[12],
    paddingVertical: theme.geometry.spacing[6],
    borderRadius: theme.geometry.radii.pill,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.tonedGreen[200],
    backgroundColor: theme.colors.tonedGreen[50],
    marginBottom: theme.geometry.spacing[8],
  },
  greenCheckDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tonedGreen[600],
    marginRight: theme.geometry.spacing[8],
  },
  activeKeyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.tonedGreen[900],
    marginRight: theme.geometry.spacing[8],
  },
  changeKeyBtn: {
    paddingHorizontal: theme.geometry.spacing[6],
    paddingVertical: 2,
    borderRadius: theme.geometry.radii.xs,
    backgroundColor: theme.colors.white,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.tonedGreen[300],
  },
  changeKeyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.darkBlue[800],
  },
  btnPressed: {
    opacity: 0.7,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.geometry.spacing[10],
  },
  keyIconContainer: {
    width: 32,
    height: 32,
    borderRadius: theme.geometry.radii.sm,
    backgroundColor: theme.colors.darkBlue[50],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.darkBlue[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.geometry.spacing[10],
    position: 'relative',
  },
  keyHead: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: theme.colors.darkBlue[600],
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 6,
    top: 7,
  },
  keyStem: {
    width: 10,
    height: 2,
    backgroundColor: theme.colors.darkBlue[600],
    position: 'absolute',
    left: 16,
    top: 12,
  },
  keyTooth1: {
    width: 2,
    height: 4,
    backgroundColor: theme.colors.darkBlue[600],
    position: 'absolute',
    left: 21,
    top: 13,
  },
  keyTooth2: {
    width: 2,
    height: 3,
    backgroundColor: theme.colors.darkBlue[600],
    position: 'absolute',
    left: 24,
    top: 13,
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.darkBlue[900],
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[500],
  },
  description: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[600],
    lineHeight: theme.typography.sizes.bodySm * theme.typography.lineHeights.normal,
    marginBottom: theme.geometry.spacing[12],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.coldGray[50],
    borderRadius: theme.geometry.radii.sm,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    paddingHorizontal: theme.geometry.spacing[12],
    paddingVertical: theme.geometry.spacing[8],
    marginBottom: theme.geometry.spacing[10],
  },
  inputWrapperFocused: {
    borderColor: theme.colors.darkBlue[600],
    backgroundColor: theme.colors.white,
  },
  inputWrapperError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  textInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    color: theme.colors.darkBlue[900],
    padding: 0,
  },
  toggleBtn: {
    paddingHorizontal: theme.geometry.spacing[8],
    paddingVertical: 2,
    marginLeft: theme.geometry.spacing[8],
  },
  toggleBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.coldGray[500],
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: theme.geometry.radii.xs,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: '#FECACA',
    padding: theme.geometry.spacing[8],
    marginBottom: theme.geometry.spacing[10],
  },
  recordingErrorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderRadius: theme.geometry.radii.sm,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: '#FECACA',
    padding: theme.geometry.spacing[10],
    marginTop: theme.geometry.spacing[12],
    width: '100%',
  },
  errorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
    marginTop: 4,
    marginRight: theme.geometry.spacing[6],
  },
  errorText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.regular,
    color: '#991B1B',
    lineHeight: theme.typography.sizes.caption * theme.typography.lineHeights.normal,
  },
  recordingErrorText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    color: '#991B1B',
    lineHeight: theme.typography.sizes.caption * theme.typography.lineHeights.normal,
  },
  submitBtn: {
    backgroundColor: theme.colors.darkBlue[600],
    borderRadius: theme.geometry.radii.sm,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.darkBlue[700],
    paddingVertical: theme.geometry.spacing[12],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.geometry.spacing[4],
  },
  submitBtnDisabled: {
    backgroundColor: theme.colors.coldGray[200],
    borderColor: theme.colors.coldGray[300],
  },
  submitBtnPressed: {
    backgroundColor: theme.colors.darkBlue[700],
  },
  submitBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.white,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.geometry.spacing[8],
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.geometry.spacing[10],
    justifyContent: 'center',
  },
  privacyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.tonedGreen[600],
    marginRight: theme.geometry.spacing[6],
  },
  privacyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    color: theme.colors.coldGray[500],
  },
});
