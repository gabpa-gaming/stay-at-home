import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme/theme';
import { defaultStyles } from '../theme/styles';
import { Header } from '../components/Header';
import { HeroTitle } from '../components/HeroTitle';
import { ApiKeyInput } from '../components/ApiKeyInput';
import { HookSection } from '../components/HookSection';

/**
 * HomeScreen Component
 *
 * Central screen of the application:
 * - Reassuring medical branding and safety status
 * - Central title 'Zostać w domu?' with AI star
 * - Groq Whisper API key input with verification, which reveals the active microphone once valid
 * - Speech-to-text recording with real-time volume reactivity and automatic silence shut-off
 * - Temporary transcript display
 * - Hook section explaining clinical value and giving peace of mind
 */
export const HomeScreen: React.FC = () => {
  const [, setActiveApiKey] = useState<string | null>(null);
  const [, setLatestTranscript] = useState<string | null>(null);

  const handleKeyValidated = (key: string) => {
    setActiveApiKey(key);
  };

  const handleTranscriptReady = (transcript: string) => {
    setLatestTranscript(transcript);
  };

  return (
    <SafeAreaView style={defaultStyles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Medical Header */}
        <Header organizationName="CENTRUM ZDROWIA CYFROWEGO" />

        {/* Central Clinical Interaction Card */}
        <View style={styles.centerSection}>
          {/* 1. Title 'Zostać w domu?' with AI star */}
          <HeroTitle />

          {/* 2. Groq Whisper Key Input -> Displays Microphone, Volume, Silence Detection & Transcript */}
          <ApiKeyInput
            onKeyValidated={handleKeyValidated}
            onTranscriptReady={handleTranscriptReady}
          />

          {/* 3. Hook text about the application */}
          <HookSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.geometry.spacing[20],
    paddingTop: theme.geometry.spacing[8],
    paddingBottom: theme.geometry.spacing[32],
    backgroundColor: theme.colors.coldGray[50],
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.geometry.spacing[12],
    width: '100%',
  },
});
