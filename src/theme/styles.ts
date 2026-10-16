import { StyleSheet } from 'react-native';
import { theme } from './theme';

const { colors, typography, geometry } = theme;

/**
 * Default Style Sheet for the Medical Application
 *
 * Emphasizes clinical precision, safety, and modern minimalism.
 * Components use simple geometric shapes and thin outlines.
 */
export const defaultStyles = StyleSheet.create({
  // Screen & Containers
  screenContainer: {
    flex: 1,
    backgroundColor: colors.coldGray[50],
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.coldGray[50],
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: geometry.spacing[20],
    paddingTop: geometry.spacing[16],
    paddingBottom: geometry.spacing[40],
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Geometric Cards with Thin Outlines
  card: {
    backgroundColor: colors.white,
    borderRadius: geometry.radii.lg,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.coldGray[200],
    padding: geometry.spacing[20],
  },
  cardCold: {
    backgroundColor: colors.coldGray[100],
    borderRadius: geometry.radii.lg,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.coldGray[200],
    padding: geometry.spacing[16],
  },
  cardSafe: {
    backgroundColor: colors.tonedGreen[50],
    borderRadius: geometry.radii.lg,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.tonedGreen[200],
    padding: geometry.spacing[16],
  },
  cardOutline: {
    backgroundColor: colors.white,
    borderRadius: geometry.radii.md,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.coldGray[200],
    padding: geometry.spacing[12],
  },

  // Typography - Dark Blue & Neutral
  displayTitle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    color: colors.darkBlue[900],
    letterSpacing: typography.letterSpacing.tight,
    textAlign: 'center',
  },
  titleLg: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.titleLg,
    fontWeight: typography.weights.bold,
    color: colors.darkBlue[900],
    letterSpacing: typography.letterSpacing.tight,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.title,
    fontWeight: typography.weights.semiBold,
    color: colors.darkBlue[900],
    letterSpacing: typography.letterSpacing.tight,
  },
  subheading: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.subheading,
    fontWeight: typography.weights.medium,
    color: colors.darkBlue[800],
  },
  body: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
    color: colors.coldGray[600],
    lineHeight: typography.sizes.body * typography.lineHeights.relaxed,
  },
  bodySm: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.bodySm,
    fontWeight: typography.weights.regular,
    color: colors.coldGray[500],
    lineHeight: typography.sizes.bodySm * typography.lineHeights.normal,
  },
  caption: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.medium,
    color: colors.coldGray[500],
  },
  microCaps: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.micro,
    fontWeight: typography.weights.semiBold,
    color: colors.coldGray[500],
    letterSpacing: typography.letterSpacing.caps,
    textTransform: 'uppercase',
  },

  // Geometric Badges & Pills with Thin Outlines
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: geometry.spacing[12],
    paddingVertical: geometry.spacing[4],
    borderRadius: geometry.radii.pill,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.coldGray[200],
    backgroundColor: colors.white,
    alignSelf: 'flex-start',
  },
  badgeSafe: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: geometry.spacing[12],
    paddingVertical: geometry.spacing[4],
    borderRadius: geometry.radii.pill,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.tonedGreen[300],
    backgroundColor: colors.tonedGreen[100],
    alignSelf: 'flex-start',
  },
  badgeTextSafe: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.semiBold,
    color: colors.tonedGreen[900],
    marginLeft: geometry.spacing[4],
  },
  badgeAi: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: geometry.spacing[12],
    paddingVertical: geometry.spacing[4],
    borderRadius: geometry.radii.pill,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.darkBlue[600],
    backgroundColor: colors.darkBlue[100],
  },
  badgeTextAi: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    color: colors.darkBlue[700],
    marginLeft: geometry.spacing[4],
  },

  // Buttons with Thin Outlines
  buttonPrimary: {
    backgroundColor: colors.darkBlue[600],
    borderRadius: geometry.radii.md,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.darkBlue[700],
    paddingVertical: geometry.spacing[16],
    paddingHorizontal: geometry.spacing[24],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.semiBold,
    color: colors.white,
  },
  buttonOutline: {
    backgroundColor: colors.white,
    borderRadius: geometry.radii.md,
    borderWidth: geometry.borderWidths.thin,
    borderColor: colors.coldGray[200],
    paddingVertical: geometry.spacing[12],
    paddingHorizontal: geometry.spacing[20],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOutlineText: {
    fontFamily: typography.fontFamily,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.medium,
    color: colors.darkBlue[900],
  },

  // Geometrical Divider
  divider: {
    height: geometry.borderWidths.thin,
    backgroundColor: colors.coldGray[200],
    marginVertical: geometry.spacing[16],
  },
});
