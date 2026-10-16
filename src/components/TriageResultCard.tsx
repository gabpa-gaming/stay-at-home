import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Linking,
} from 'react-native';
import { theme } from '../theme/theme';
import {
  CATEGORY_CONFIG,
  TriageModelOutput,
} from '../prompts/triageConfig';

interface TriageResultCardProps {
  result: TriageModelOutput;
  onReset?: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * TriageResultCard Component
 *
 * Displays the AI medical triage response to patient-reported symptoms.
 * Visually communicates the 5 distinct categories:
 * - Green: Pacjent może pójść do pracy
 * - Yellow: Zalecana rozmowa z lekarzem
 * - Orange: Zostań w domu + zalecana rozmowa z lekarzem
 * - Red: Zagrożenie życia - Natychmiast idź do szpitala
 * - Gray: Out of scope
 *
 * Shows detected symptoms, clinical reasoning, and concrete action advice.
 */
export const TriageResultCard: React.FC<TriageResultCardProps> = ({
  result,
  onReset,
  style,
}) => {
  const config = CATEGORY_CONFIG[result.category] || CATEGORY_CONFIG.out_of_scope;
  const isEmergency = result.category === 'emergency';

  const handleCallEmergency = () => {
    Linking.openURL('tel:112').catch((err) => {
      console.log('Cannot initiate phone call:', err);
    });
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
        style,
      ]}
    >
      {/* Category Status Pill & Reset Action */}
      <View style={styles.topRow}>
        <View style={[styles.badge, { borderColor: config.borderColor, backgroundColor: theme.colors.white }]}>
          <View style={[styles.statusDot, { backgroundColor: config.color }]} />
          <Text style={[styles.badgeText, { color: config.textColor }]}>
            {config.badgeLabel}
          </Text>
        </View>

        {onReset && (
          <Pressable
            onPress={onReset}
            accessibilityRole="button"
            accessibilityLabel="Wykonaj nową konsultację"
            style={({ pressed }) => [
              styles.resetBtn,
              pressed && styles.resetBtnPressed,
            ]}
          >
            <Text style={styles.resetBtnText}>Nowe nagranie</Text>
          </Pressable>
        )}
      </View>

      {/* Main Category Headline */}
      <Text style={[styles.mainHeadline, { color: config.textColor }]}>
        {config.title}
      </Text>

      {/* Clinical Action Advice */}
      <View style={styles.adviceBox}>
        <Text style={styles.adviceText}>{config.actionAdvice}</Text>
      </View>

      {/* Emergency Immediate Action Banner (Red Category Only) */}
      {isEmergency && (
        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyWarningTitle}>PILNA INTERWENCJA MEDYCZNA</Text>
          <Text style={styles.emergencyWarningText}>
            W przypadku duszności, bólu w klatce piersiowej lub nagłych zaburzeń niezwłocznie zadzwoń pod numer alarmowy.
          </Text>
          <Pressable
            onPress={handleCallEmergency}
            accessibilityRole="button"
            accessibilityLabel="Zadzwoń pod numer alarmowy 112"
            style={({ pressed }) => [
              styles.emergencyCallBtn,
              pressed && styles.emergencyCallBtnPressed,
            ]}
          >
            <Text style={styles.emergencyCallBtnText}>Zadzwoń na 112 (Pogotowie)</Text>
          </Pressable>
        </View>
      )}

      {/* Extracted Symptoms Tags */}
      {result.symptoms && result.symptoms.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Zidentyfikowane objawy:</Text>
          <View style={styles.symptomsTagRow}>
            {result.symptoms.map((symptom, idx) => (
              <View key={idx} style={styles.symptomTag}>
                <View style={styles.symptomTagDot} />
                <Text style={styles.symptomTagText}>{symptom}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* AI Clinical Reasoning Box */}
      {result.reasoning ? (
        <View style={styles.reasoningCard}>
          <View style={styles.reasoningHeaderRow}>
            <View style={styles.aiSparkleIcon} />
            <Text style={styles.reasoningHeader}>Wnioskowanie modelu AI (Reasoning):</Text>
          </View>
          <Text style={styles.reasoningContent}>{result.reasoning}</Text>
        </View>
      ) : null}

      {/* Medical Pre-screening Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Wstępny triage administracyjny AI nie stanowi diagnozy lekarskiej. W razie wątpliwości lub pogorszenia samopoczucia zasięgnij porady lekarza.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.geometry.radii.lg,
    borderWidth: 1.5,
    padding: theme.geometry.spacing[16],
    marginVertical: theme.geometry.spacing[16],
    // Clean clinical shadow
    shadowColor: theme.colors.darkBlue[900],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.geometry.spacing[12],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.geometry.spacing[10],
    paddingVertical: theme.geometry.spacing[4],
    borderRadius: theme.geometry.radii.pill,
    borderWidth: theme.geometry.borderWidths.thin,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: theme.geometry.spacing[6],
  },
  badgeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: theme.typography.letterSpacing.wide,
    textTransform: 'uppercase',
  },
  resetBtn: {
    paddingHorizontal: theme.geometry.spacing[8],
    paddingVertical: 3,
    backgroundColor: theme.colors.white,
    borderRadius: theme.geometry.radii.xs,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[300],
  },
  resetBtnPressed: {
    opacity: 0.65,
  },
  resetBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.coldGray[600],
  },
  mainHeadline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.titleSm + 1,
    fontWeight: theme.typography.weights.bold,
    letterSpacing: theme.typography.letterSpacing.tight,
    marginBottom: theme.geometry.spacing[8],
  },
  adviceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: theme.geometry.radii.sm,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    padding: theme.geometry.spacing[12],
    marginBottom: theme.geometry.spacing[12],
  },
  adviceText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.darkBlue[900],
    lineHeight: theme.typography.sizes.bodySm * theme.typography.lineHeights.relaxed,
  },
  emergencyBox: {
    backgroundColor: '#DC2626',
    borderRadius: theme.geometry.radii.md,
    padding: theme.geometry.spacing[14],
    marginBottom: theme.geometry.spacing[14],
    alignItems: 'center',
  },
  emergencyWarningTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: 4,
  },
  emergencyWarningText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    color: '#FEE2E2',
    textAlign: 'center',
    marginBottom: theme.geometry.spacing[10],
  },
  emergencyCallBtn: {
    backgroundColor: theme.colors.white,
    paddingVertical: theme.geometry.spacing[10],
    paddingHorizontal: theme.geometry.spacing[20],
    borderRadius: theme.geometry.radii.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyCallBtnPressed: {
    backgroundColor: '#FEE2E2',
  },
  emergencyCallBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.bold,
    color: '#991B1B',
  },
  sectionContainer: {
    marginBottom: theme.geometry.spacing[12],
  },
  sectionHeader: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.coldGray[600],
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: theme.geometry.spacing[6],
  },
  symptomsTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.geometry.spacing[6],
  },
  symptomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.geometry.radii.pill,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    paddingHorizontal: theme.geometry.spacing[10],
    paddingVertical: 4,
  },
  symptomTagDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.colors.darkBlue[600],
    marginRight: theme.geometry.spacing[6],
  },
  symptomTagText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.darkBlue[900],
  },
  reasoningCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.geometry.radii.sm,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    padding: theme.geometry.spacing[12],
    marginBottom: theme.geometry.spacing[12],
  },
  reasoningHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.geometry.spacing[4],
  },
  aiSparkleIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.darkBlue[600],
    marginRight: theme.geometry.spacing[6],
  },
  reasoningHeader: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.darkBlue[700],
  },
  reasoningContent: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[600],
    lineHeight: theme.typography.sizes.caption * theme.typography.lineHeights.relaxed,
  },
  disclaimerContainer: {
    borderTopWidth: theme.geometry.borderWidths.thin,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    paddingTop: theme.geometry.spacing[8],
  },
  disclaimerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    color: theme.colors.coldGray[500],
    textAlign: 'center',
    lineHeight: theme.typography.sizes.micro * theme.typography.lineHeights.normal,
  },
});
