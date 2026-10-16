import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme/theme';
import { MicrophoneIcon } from './MicrophoneIcon';

interface VoiceButtonProps {
  onPress?: () => void;
  isRecording?: boolean;
  isTranscribing?: boolean;
  volume?: number; // Normalized 0.0 to 1.0
  silenceDetected?: boolean;
  statusMessage?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * VoiceButton Component
 *
 * Prominent white microphone icon centered inside an authoritative blue circle.
 * Reacts dynamically to volume levels via expanding concentric geometric rings
 * and a soundwave meter. Communicates recording, silence detection, and transcription states.
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onPress,
  isRecording = false,
  isTranscribing = false,
  volume = 0,
  silenceDetected = false,
  statusMessage,
  style,
}) => {
  const pressAnim = useRef(new Animated.Value(1)).current;
  const volumeAnim = useRef(new Animated.Value(0)).current;

  // Animate volume changes smoothly
  useEffect(() => {
    Animated.timing(volumeAnim, {
      toValue: isRecording ? volume : 0,
      duration: 70,
      useNativeDriver: true,
    }).start();
  }, [volume, isRecording, volumeAnim]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 25,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
    }).start();
  };

  // Dynamic scale interpolations based on volume
  const outerRing2Scale = volumeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.34],
  });

  const outerRing1Scale = volumeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.20],
  });

  const circleScale = volumeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const getStatusText = () => {
    if (statusMessage) return statusMessage;
    if (isTranscribing) return 'Transkrypcja mowy (Groq Whisper)...';
    if (isRecording) {
      return silenceDetected
        ? 'Wykryto ciszę... zatrzymywanie'
        : 'Słucham... opisz objawy';
    }
    return 'Dotknij, aby opisać objawy';
  };

  const getSubStatusText = () => {
    if (isTranscribing) return 'Konwersja głosu na tekst w toku';
    if (isRecording) {
      return silenceDetected
        ? 'Automatyczne wyłączenie po kilku sekundach ciszy'
        : 'Mów swobodnie o swoich dolegliwościach';
    }
    return 'Wystarczy krótka wypowiedź głosem';
  };

  return (
    <View style={[styles.wrapper, style]}>
      {/* Outer Concentric Geometric Ring (reacts to volume) */}
      <Animated.View
        style={[
          styles.outerRing2,
          isRecording && styles.outerRing2Active,
          silenceDetected && styles.outerRing2Silence,
          { transform: [{ scale: outerRing2Scale }] },
        ]}
      >
        {/* Middle Concentric Geometric Ring (reacts to volume) */}
        <Animated.View
          style={[
            styles.outerRing1,
            isRecording && styles.outerRing1Active,
            silenceDetected && styles.outerRing1Silence,
            { transform: [{ scale: outerRing1Scale }] },
          ]}
        >
          {/* Main Blue Circle Action Button */}
          <Animated.View
            style={{
              transform: [
                { scale: pressAnim },
                { scale: circleScale },
              ],
            }}
          >
            <Pressable
              onPress={onPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isTranscribing}
              accessibilityRole="button"
              accessibilityLabel={isRecording ? 'Zatrzymaj nagrywanie' : 'Rozpocznij nagrywanie objawów'}
              accessibilityHint="Dotknij, aby nagrać opis dolegliwości"
              style={({ pressed }) => [
                styles.blueCircle,
                pressed && styles.blueCirclePressed,
                isRecording && styles.blueCircleListening,
                isTranscribing && styles.blueCircleTranscribing,
              ]}
            >
              {isTranscribing ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <MicrophoneIcon size={38} color={theme.colors.white} />
              )}
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Animated.View>

      {/* Real-time Audio Level Soundwave Visualizer (reacts to volume) */}
      {isRecording && (
        <View style={styles.waveformContainer}>
          {[0.5, 0.8, 1.0, 0.8, 0.5].map((multiplier, idx) => {
            const barHeight = Math.max(4, Math.round(6 + volume * 24 * multiplier));
            return (
              <View
                key={idx}
                style={[
                  styles.waveformBar,
                  {
                    height: barHeight,
                    backgroundColor: silenceDetected
                      ? theme.colors.coldGray[400]
                      : theme.colors.darkBlue[600],
                  },
                ]}
              />
            );
          })}
        </View>
      )}

      {/* Button Subtitle / Status Prompt */}
      <View style={styles.promptContainer}>
        <View style={styles.statusIndicatorRow}>
          <View
            style={[
              styles.statusDot,
              isTranscribing
                ? styles.statusDotTranscribing
                : isRecording
                ? silenceDetected
                  ? styles.statusDotSilence
                  : styles.statusDotListening
                : styles.statusDotReady,
            ]}
          />
          <Text style={styles.promptText}>{getStatusText()}</Text>
        </View>
        <Text style={styles.subPromptText}>{getSubStatusText()}</Text>
      </View>
    </View>
  );
};

const BUTTON_SIZE = 92;
const RING_1_SIZE = BUTTON_SIZE + 28; // 120
const RING_2_SIZE = RING_1_SIZE + 32; // 152

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.geometry.spacing[16],
  },
  outerRing2: {
    width: RING_2_SIZE,
    height: RING_2_SIZE,
    borderRadius: RING_2_SIZE / 2,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    backgroundColor: theme.colors.coldGray[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing2Active: {
    borderColor: theme.colors.overlay.blueRing,
    backgroundColor: theme.colors.darkBlue[50],
  },
  outerRing2Silence: {
    borderColor: theme.colors.coldGray[300],
    backgroundColor: theme.colors.coldGray[100],
  },
  outerRing1: {
    width: RING_1_SIZE,
    height: RING_1_SIZE,
    borderRadius: RING_1_SIZE / 2,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing1Active: {
    borderColor: theme.colors.darkBlue[400],
    backgroundColor: theme.colors.darkBlue[100],
  },
  outerRing1Silence: {
    borderColor: theme.colors.coldGray[300],
  },
  blueCircle: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: theme.colors.darkBlue[600],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.darkBlue[700],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.darkBlue[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 3,
  },
  blueCirclePressed: {
    backgroundColor: theme.colors.darkBlue[700],
  },
  blueCircleListening: {
    backgroundColor: theme.colors.darkBlue[700],
    borderColor: theme.colors.darkBlue[400],
  },
  blueCircleTranscribing: {
    backgroundColor: theme.colors.darkBlue[800],
    borderColor: theme.colors.darkBlue[500],
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 32,
    marginTop: theme.geometry.spacing[8],
  },
  waveformBar: {
    width: 3.5,
    borderRadius: 2,
  },
  promptContainer: {
    alignItems: 'center',
    marginTop: theme.geometry.spacing[12],
  },
  statusIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.geometry.spacing[4],
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: theme.geometry.spacing[8],
  },
  statusDotReady: {
    backgroundColor: theme.colors.tonedGreen[500],
  },
  statusDotListening: {
    backgroundColor: theme.colors.darkBlue[600],
  },
  statusDotSilence: {
    backgroundColor: '#EAB308', // Amber warning for silence countdown
  },
  statusDotTranscribing: {
    backgroundColor: theme.colors.darkBlue[400],
  },
  promptText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.darkBlue[900],
  },
  subPromptText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[500],
  },
});
