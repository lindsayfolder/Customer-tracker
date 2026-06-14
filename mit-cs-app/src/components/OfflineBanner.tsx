import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface OfflineBannerProps {
  isOnline: boolean;
}

export default function OfflineBanner({ isOnline }: OfflineBannerProps) {
  if (isOnline) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>No internet connection — code execution unavailable</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F59E0B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  text: {
    color: '#1a1a00',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
