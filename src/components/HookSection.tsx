import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

/**
 * HookSection Component
 *
 * Compelling, reassuring hook text explaining the purpose of the application:
 * giving patients clarity and safety on whether they should stay at home
 * or seek emergency/outpatient medical attention.
 */
export const HookSection: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Primary Hook Headline */}
      <Text style={styles.hookHeadline}>
        Pewność i spokój bez wychodzenia z łóżka
      </Text>

      {/* Narrative Hook Paragraph */}
      <Text style={styles.hookParagraph}>
        Nie wiesz, czy Twoje dolegliwości wymagają wizyty w przychodni?
        Opowiedz o swoich objawach. Asystent medyczny oparty o sztuczną inteligencję
        oceni poziom ryzyka i wskaże, czy możesz bezpiecznie kurować się w domu,
        czy warto skonsultować się z lekarzem.
      </Text>

      {/* Geometrical Feature Indicators with Thin Outlines */}
      <View style={styles.featuresContainer}>
        {/* Feature 1: Safe Home Care */}
        <View style={styles.featureCard}>
          <View style={styles.featureIconBoxGreen}>
            <View style={styles.checkIconMark} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Bezpieczna opieka domowa</Text>
            <Text style={styles.featureDescription}>
              Unikaj zbędnego czekania w zatłoczonych poczekalniach i ogranicz kontakt z patogenami.
            </Text>
          </View>
        </View>

        {/* Feature 2: Clinical Verification */}
        <View style={styles.featureCard}>
          <View style={styles.featureIconBoxBlue}>
            <View style={styles.pulseDot} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Medyczny algorytm triage</Text>
            <Text style={styles.featureDescription}>
              Błyskawiczna analiza symptomów oparta na zweryfikowanych wytycznych klinicznych.
            </Text>
          </View>
        </View>

        {/* Feature 3: Patient Privacy */}
        <View style={styles.featureCard}>
          <View style={styles.featureIconBoxGray}>
            <View style={styles.lockShape} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Poufność i ochrona danych</Text>
            <Text style={styles.featureDescription}>
              Twoje nagranie i dane medyczne podlegają rygorystycznemu szyfrowaniu.
            </Text>
          </View>
        </View>
      </View>

      {/* Emergency Notice Note */}
      <View style={styles.emergencyNotice}>
        <Text style={styles.emergencyText}>
          W przypadku nagłego pogorszenia stanu zdrowia lub bezpośredniego zagrożenia życia należy niezwłocznie zadzwonić pod numer alarmowy 112.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: theme.geometry.spacing[8],
  },
  hookHeadline: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.subheading,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.darkBlue[900],
    textAlign: 'center',
    marginBottom: theme.geometry.spacing[8],
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  hookParagraph: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[600],
    textAlign: 'center',
    lineHeight: theme.typography.sizes.bodySm * theme.typography.lineHeights.relaxed,
    marginBottom: theme.geometry.spacing[20],
    paddingHorizontal: theme.geometry.spacing[8],
  },
  featuresContainer: {
    gap: theme.geometry.spacing[10],
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.white,
    borderRadius: theme.geometry.radii.md,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    padding: theme.geometry.spacing[14],
  },
  featureIconBoxGreen: {
    width: 28,
    height: 28,
    borderRadius: theme.geometry.radii.xs,
    backgroundColor: theme.colors.tonedGreen[100],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.tonedGreen[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.geometry.spacing[12],
    marginTop: 2,
  },
  checkIconMark: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: theme.colors.tonedGreen[700],
    transform: [{ rotate: '45deg' }, { translateY: -1 }],
  },
  featureIconBoxBlue: {
    width: 28,
    height: 28,
    borderRadius: theme.geometry.radii.xs,
    backgroundColor: theme.colors.darkBlue[100],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.darkBlue[400],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.geometry.spacing[12],
    marginTop: 2,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.darkBlue[600],
  },
  featureIconBoxGray: {
    width: 28,
    height: 28,
    borderRadius: theme.geometry.radii.xs,
    backgroundColor: theme.colors.coldGray[100],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.geometry.spacing[12],
    marginTop: 2,
  },
  lockShape: {
    width: 8,
    height: 9,
    borderWidth: 1.5,
    borderColor: theme.colors.coldGray[600],
    borderRadius: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.darkBlue[900],
    marginBottom: 2,
  },
  featureDescription: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[500],
    lineHeight: theme.typography.sizes.caption * theme.typography.lineHeights.normal,
  },
  emergencyNotice: {
    marginTop: theme.geometry.spacing[16],
    paddingVertical: theme.geometry.spacing[10],
    paddingHorizontal: theme.geometry.spacing[12],
    borderRadius: theme.geometry.radii.sm,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    backgroundColor: theme.colors.coldGray[100],
  },
  emergencyText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[500],
    textAlign: 'center',
    lineHeight: theme.typography.sizes.micro * theme.typography.lineHeights.relaxed,
  },
});
