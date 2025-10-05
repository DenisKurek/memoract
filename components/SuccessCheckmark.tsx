import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SuccessCheckmarkProps {
  visible: boolean;
  onComplete?: () => void;
}

export default function SuccessCheckmark({ visible, onComplete }: SuccessCheckmarkProps) {
  const opacity = useSharedValue(0);
  const checkmarkScale = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Fade in background
      opacity.value = withTiming(1, { duration: 200 });

      // Circle appears with spring
      circleScale.value = withSpring(1, {
        damping: 12,
        stiffness: 150,
      });

      // Checkmark draws in with delay
      checkmarkScale.value = withDelay(
        150,
        withSpring(1, {
          damping: 10,
          stiffness: 200,
        })
      );

      // Subtle rotation for effect
      rotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

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
      checkmarkScale.value = 0;
      circleScale.value = 0;
      rotation.value = 0;
    }
  }, [visible, opacity, checkmarkScale, circleScale, rotation, onComplete]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const circleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: circleScale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  const checkmarkStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkmarkScale.value }],
    };
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.circle, circleStyle]}>
        <Animated.View style={checkmarkStyle}>
          <Ionicons name="checkmark" size={50} color="#fff" />
        </Animated.View>
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
