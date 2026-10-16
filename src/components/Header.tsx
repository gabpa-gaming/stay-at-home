import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface HeaderProps {
  organizationName?: string;
}

/**
 * Medical Header Component
 *
 * Provides reassuring clinical identity with thin outlines,
 * geometric medical cross emblem, and verified medical status pill.
 */
export const Header: React.FC<HeaderProps> = ({
  organizationName = 'MEDCARE AI TRIAGE',
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Brand Identity / Clinical Cross */}
      <View style={styles.brandGroup}>
        <View style={styles.crossContainer}>
          {/* Vertical bar */}
          <View style={styles.crossVertical} />
          {/* Horizontal bar */}
          <View style={styles.crossHorizontal} />
        </View>
        <View style={styles.brandTextGroup}>
          <Text style={styles.brandTitle}>STAY AT HOME</Text>
          <Text style={styles.brandSubtitle}>{organizationName}</Text>
        </View>
      </View>

      {/* Safety Status Pill (Toned Green) */}
      <View style={styles.statusPill}>
        <View style={styles.statusDot} />
        <Text style={styles.statusText}>Bezpieczne AI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.geometry.spacing[12],
    paddingHorizontal: theme.geometry.spacing[4],
    borderBottomWidth: theme.geometry.borderWidths.thin,
    borderBottomColor: theme.colors.coldGray[200],
    marginBottom: theme.geometry.spacing[16],
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crossContainer: {
    width: 28,
    height: 28,
    borderRadius: theme.geometry.radii.xs,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[300],
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.geometry.spacing[10],
  },
  crossVertical: {
    position: 'absolute',
    width: 4,
    height: 14,
    backgroundColor: theme.colors.tonedGreen[700],
    borderRadius: 1,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 14,
    height: 4,
    backgroundColor: theme.colors.tonedGreen[700],
    borderRadius: 1,
  },
  brandTextGroup: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.bodySm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.darkBlue[900],
    letterSpacing: theme.typography.letterSpacing.wide,
  },
  brandSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.coldGray[500],
    letterSpacing: theme.typography.letterSpacing.caps,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.geometry.spacing[10],
    paddingVertical: theme.geometry.spacing[4],
    borderRadius: theme.geometry.radii.pill,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.tonedGreen[200],
    backgroundColor: theme.colors.tonedGreen[50],
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tonedGreen[600],
    marginRight: theme.geometry.spacing[6],
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.tonedGreen[900],
    letterSpacing: theme.typography.letterSpacing.normal,
  },
});
