import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { theme } from '../theme/theme';

interface AiStarProps {
  size?: number;
  color?: string;
  outlineColor?: string;
  style?: StyleProp<ViewStyle>;
  showMiniSparkle?: boolean;
}

/**
 * Geometric AI Star Component
 *
 * A modern 4-pointed diamond star signaling artificial intelligence.
 * Designed with simple geometry and clean outlines.
 */
export const AiStar: React.FC<AiStarProps> = ({
  size = 24,
  color = theme.colors.darkBlue[600],
  outlineColor,
  style,
  showMiniSparkle = true,
}) => {
  const halfSize = size / 2;
  const lobeThickness = size * 0.32;
  const miniSize = size * 0.38;

  return (
    <View style={[{ width: size * (showMiniSparkle ? 1.25 : 1), height: size }, styles.container, style]}>
      {/* Primary 4-pointed Star */}
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        {/* Vertical lobe */}
        <View
          style={[
            styles.lobe,
            {
              width: lobeThickness,
              height: size,
              borderRadius: lobeThickness / 2,
              backgroundColor: color,
              borderColor: outlineColor ?? 'transparent',
              borderWidth: outlineColor ? 1 : 0,
            },
          ]}
        />
        {/* Horizontal lobe */}
        <View
          style={[
            styles.lobe,
            {
              width: size,
              height: lobeThickness,
              borderRadius: lobeThickness / 2,
              backgroundColor: color,
              borderColor: outlineColor ?? 'transparent',
              borderWidth: outlineColor ? 1 : 0,
            },
          ]}
        />
        {/* Center core diamond with thin outline */}
        <View
          style={[
            styles.coreDiamond,
            {
              width: lobeThickness * 1.05,
              height: lobeThickness * 1.05,
              backgroundColor: color,
              borderColor: theme.colors.white,
              borderWidth: 0.8,
            },
          ]}
        />
      </View>

      {/* Secondary mini AI sparkle */}
      {showMiniSparkle && (
        <View
          style={[
            styles.miniSparkleContainer,
            {
              right: 0,
              top: 0,
              width: miniSize,
              height: miniSize,
            },
          ]}
        >
          <View
            style={[
              styles.lobe,
              {
                width: miniSize * 0.32,
                height: miniSize,
                borderRadius: (miniSize * 0.32) / 2,
                backgroundColor: color,
              },
            ]}
          />
          <View
            style={[
              styles.lobe,
              {
                width: miniSize,
                height: miniSize * 0.32,
                borderRadius: (miniSize * 0.32) / 2,
                backgroundColor: color,
              },
            ]}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  lobe: {
    position: 'absolute',
  },
  coreDiamond: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
  miniSparkleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
  },
});
