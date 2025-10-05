import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SuccessCheckmarkProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function SuccessCheckmark({ visible, onComplete }: SuccessCheckmarkProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Animate in
      scale.value = withSequence(
        withSpring(1.2, { damping: 8, stiffness: 100 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );
      opacity.value = withTiming(1, { duration: 200 });

      // Auto-hide after 1.5 seconds
      const timer = setTimeout(() => {
        scale.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) });
        opacity.value = withTiming(0, { duration: 200 });
        if (onComplete) {
          setTimeout(onComplete, 250);
        }
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible, scale, opacity, onComplete]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.checkmarkContainer, animatedStyle]}>
        <View style={styles.circle}>
          <Ionicons name="checkmark" size={40} color="#fff" />
        </View>
      </Animated.View>
    </View>
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
  checkmarkContainer: {
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
});

