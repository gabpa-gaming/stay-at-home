import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { AiStar } from './AiStar';

interface HeroTitleProps {
  subtitle?: string;
}

/**
 * HeroTitle Component
 *
 * Displays the central question: 'Zostać w domu?'
 * accompanied by the geometric AI star signaling intelligent clinical triage.
 */
export const HeroTitle: React.FC<HeroTitleProps> = ({
  subtitle = 'Inteligentna weryfikacja medyczna objawów',
}) => {
  return (
    <View style={styles.container}>
      {/* Category / Pre-title Chip */}
      <View style={styles.aiChip}>
        <AiStar size={13} color={theme.colors.darkBlue[600]} showMiniSparkle={false} />
        <Text style={styles.aiChipText}>MEDYCZNY ASYSTENT AI</Text>
      </View>

      {/* Main Title Row with AI Star */}
      <View style={styles.titleRow}>
        <Text style={styles.mainTitle}>Zostać w domu?</Text>
        <View style={styles.starContainer}>
          <AiStar size={26} color={theme.colors.darkBlue[600]} />
        </View>
      </View>

      {/* Clinical reassurance subtitle */}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.geometry.spacing[8],
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.geometry.spacing[10],
    paddingVertical: theme.geometry.spacing[4],
    borderRadius: theme.geometry.radii.pill,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    backgroundColor: theme.colors.white,
    marginBottom: theme.geometry.spacing[12],
    gap: theme.geometry.spacing[6],
  },
  aiChipText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.darkBlue[700],
    letterSpacing: theme.typography.letterSpacing.caps,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.titleLg + 2, // ~30px
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.darkBlue[900],
    letterSpacing: theme.typography.letterSpacing.tight,
    textAlign: 'center',
  },
  starContainer: {
    marginLeft: theme.geometry.spacing[10],
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.coldGray[500],
    textAlign: 'center',
    marginTop: theme.geometry.spacing[6],
  },
});
