import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

interface TranscriptCardProps {
  transcript: string;
  onDismiss: () => void;
  autoHideDurationSeconds?: number;
}

/**
 * TranscriptCard Component
 *
 * Temporarily displays the speech-to-text transcript captured from the patient's voice.
 * Styled with clinical clarity, thin outlines, and automatic countdown timer.
 */
export const TranscriptCard: React.FC<TranscriptCardProps> = ({
  transcript,
  onDismiss,
  autoHideDurationSeconds = 14,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(autoHideDurationSeconds);

  useEffect(() => {
    setSecondsRemaining(autoHideDurationSeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [transcript, autoHideDurationSeconds, onDismiss]);

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.statusBadge}>
          <View style={styles.greenDot} />
          <Text style={styles.statusText}>Transkrypcja mowy (Groq Whisper)</Text>
        </View>

        <View style={styles.timerAndCloseGroup}>
          <Text style={styles.timerText}>{secondsRemaining}s</Text>
          <Pressable
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Zamknij podgląd tekstu"
            style={({ pressed }) => [
              styles.closeBtn,
              pressed && styles.closeBtnPressed,
            ]}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>
        </View>
      </View>

      {/* Transcript Content Box with Thin Outline */}
      <View style={styles.quoteBox}>
        <Text style={styles.transcriptText}>
          „{transcript}”
        </Text>
      </View>

      {/* Footer Info */}
      <View style={styles.footerRow}>
        <Text style={styles.footerNote}>
          Tekst zostanie automatycznie ukryty. Dotknij mikrofonu, aby nagrać ponownie.
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
    borderColor: theme.colors.tonedGreen[200],
    padding: theme.geometry.spacing[16],
    marginVertical: theme.geometry.spacing[14],
    // Clean clinical elevation
    shadowColor: theme.colors.darkBlue[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.geometry.spacing[12],
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tonedGreen[50],
    borderRadius: theme.geometry.radii.pill,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.tonedGreen[200],
    paddingHorizontal: theme.geometry.spacing[10],
    paddingVertical: theme.geometry.spacing[4],
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.tonedGreen[600],
    marginRight: theme.geometry.spacing[6],
  },
  statusText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semiBold,
    color: theme.colors.tonedGreen[900],
  },
  timerAndCloseGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.geometry.spacing[8],
  },
  timerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.coldGray[500],
  },
  closeBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.coldGray[100],
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnPressed: {
    backgroundColor: theme.colors.coldGray[200],
  },
  closeBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.coldGray[600],
    lineHeight: 14,
  },
  quoteBox: {
    backgroundColor: theme.colors.coldGray[50],
    borderRadius: theme.geometry.radii.md,
    borderWidth: theme.geometry.borderWidths.thin,
    borderColor: theme.colors.coldGray[200],
    padding: theme.geometry.spacing[14],
    marginBottom: theme.geometry.spacing[10],
  },
  transcriptText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.darkBlue[900],
    lineHeight: theme.typography.sizes.body * theme.typography.lineHeights.relaxed,
    fontStyle: 'italic',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerNote: {
    fontFamily: theme.typography.fontFamily,
    fontSize: theme.typography.sizes.micro,
    color: theme.colors.coldGray[500],
    textAlign: 'center',
    width: '100%',
  },
});
