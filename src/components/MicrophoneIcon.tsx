import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface MicrophoneIconProps {
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Geometric Microphone Icon Component
 *
 * Built from clean, geometric primitives with thin outlines.
 * Scales proportionally to any size while preserving sharp medical clarity.
 */
export const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({
  size = 40,
  color = theme.colors.white,
  style,
}) => {
  // Proportions
  const stroke = Math.max(2, Math.round(size * 0.08));
  const capsuleWidth = Math.round(size * 0.42);
  const capsuleHeight = Math.round(size * 0.62);
  const cradleWidth = Math.round(size * 0.76);
  const cradleHeight = Math.round(size * 0.44);
  const stemHeight = Math.round(size * 0.20);
  const baseWidth = Math.round(size * 0.52);

  return (
    <View style={[{ width: size, height: size * 1.08, alignItems: 'center' }, style]}>
      {/* Microphone Capsule */}
      <View
        style={[
          styles.capsule,
          {
            width: capsuleWidth,
            height: capsuleHeight,
            borderRadius: capsuleWidth / 2,
            backgroundColor: color,
          },
        ]}
      />

      {/* U-Shaped Cradle Bracket */}
      <View
        style={[
          styles.cradle,
          {
            width: cradleWidth,
            height: cradleHeight,
            borderBottomLeftRadius: cradleWidth / 2,
            borderBottomRightRadius: cradleWidth / 2,
            borderWidth: stroke,
            borderTopWidth: 0,
            borderColor: color,
            marginTop: -cradleHeight * 0.58,
          },
        ]}
      />

      {/* Vertical Stem */}
      <View
        style={[
          styles.stem,
          {
            width: stroke,
            height: stemHeight,
            backgroundColor: color,
          },
        ]}
      />

      {/* Horizontal Base Stand */}
      <View
        style={[
          styles.base,
          {
            width: baseWidth,
            height: stroke,
            borderRadius: stroke / 2,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  capsule: {
    zIndex: 2,
  },
  cradle: {
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  stem: {
    marginTop: 0,
  },
  base: {},
});
