import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SuccessCheckmarkProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function SuccessCheckmark({ visible, onComplete }: SuccessCheckmarkProps) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Simple fade in
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.ease),
      });

      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.ease),
        });
        if (onComplete) {
          setTimeout(onComplete, 350);
        }
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      opacity.value = 0;
    }
  }, [visible, opacity, onComplete]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={styles.circle}>
        <Ionicons name="checkmark" size={50} color="#fff" />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 9999,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
});
