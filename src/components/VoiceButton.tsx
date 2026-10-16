import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Animated,
} from 'react-native';
import { theme } from '../theme/theme';
import { MicrophoneIcon } from './MicrophoneIcon';

interface VoiceButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * VoiceButton Component
 *
 * Prominent white microphone icon centered inside an authoritative blue circle.
 * Surrounded by thin, geometrical concentric outline rings that evoke
 * safe acoustic triage, clarity, and precision.
 */
export const VoiceButton: React.FC<VoiceButtonProps> = ({ onPress, style }) => {
  const [isListening, setIsListening] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const handlePress = () => {
    setIsListening((prev) => !prev);
    onPress?.();
  };

  return (
    <View style={[styles.wrapper, style]}>
      {/* Outer Concentric Geometric Ring (Thin Outline) */}
      <View
        style={[
          styles.outerRing2,
          isListening && styles.outerRing2Active,
        ]}
      >
        {/* Middle Concentric Geometric Ring (Thin Outline) */}
        <View
          style={[
            styles.outerRing1,
            isListening && styles.outerRing1Active,
          ]}
        >
          {/* Main Blue Circle Action Button */}
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPress={handlePress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              accessibilityRole="button"
              accessibilityLabel="Rozpocznij nagrywanie objawów"
              accessibilityHint="Dotknij, aby uruchomić medyczną analizę głosową objawów"
              style={({ pressed }) => [
                styles.blueCircle,
                pressed && styles.blueCirclePressed,
                isListening && styles.blueCircleListening,
              ]}
            >
              <MicrophoneIcon size={38} color={theme.colors.white} />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      {/* Button Subtitle / Status Prompt */}
      <View style={styles.promptContainer}>
        <View style={styles.statusIndicatorRow}>
          <View
            style={[
              styles.statusDot,
              isListening ? styles.statusDotListening : styles.statusDotReady,
            ]}
          />
          <Text style={styles.promptText}>
            {isListening ? 'Słucham... opisz objawy' : 'Dotknij, aby opisać objawy'}
          </Text>
        </View>
        <Text style={styles.subPromptText}>
          {isListening ? 'Mów swobodnie o dolegliwościach' : 'Wystarczy krótka wypowiedź głosem'}
        </Text>
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
    marginVertical: theme.geometry.spacing[20],
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
  blueCircle: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: theme.colors.darkBlue[600],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.darkBlue[700],
    alignItems: 'center',
    justifyContent: 'center',
    // Elevation / subtle focus ring
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
  promptContainer: {
    alignItems: 'center',
    marginTop: theme.geometry.spacing[16],
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
