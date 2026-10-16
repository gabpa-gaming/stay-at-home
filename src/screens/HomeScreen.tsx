import React from 'react';
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
import { VoiceButton } from '../components/VoiceButton';
import { HookSection } from '../components/HookSection';

/**
 * HomeScreen Component
 *
 * Central screen of the application:
 * - Reassuring medical branding and safety status
 * - Central title 'Zostać w domu?' with AI star
 * - White microphone icon on an authoritative blue circle
 * - Hook section explaining the clinical value and giving peace of mind
 */
export const HomeScreen: React.FC = () => {
  const handleStartVoiceTriage = () => {
    // Action handler for initiating audio symptom consultation
    console.log('Initiating AI medical triage session...');
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

          {/* 2. White microphone icon on blue circle */}
          <VoiceButton onPress={handleStartVoiceTriage} />

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
  },
});
