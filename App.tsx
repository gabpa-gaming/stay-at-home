import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { theme } from './src/theme/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.coldGray[50],
  },
});
