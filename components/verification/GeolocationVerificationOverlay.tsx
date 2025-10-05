import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface GeolocationVerificationOverlayProps {
  visible: boolean;
  onComplete: () => void;
}

const { width } = Dimensions.get("window");

export default function GeolocationVerificationOverlay({
  visible,
  onComplete,
}: GeolocationVerificationOverlayProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0);
  const ringScale1 = useSharedValue(1);
  const ringScale2 = useSharedValue(1);
  const ringScale3 = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Scale in animation
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
        mass: 1,
      });

      // Fade in
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });

      // Continuous rotation for location icon
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        }),
        1, // Only repeat once (2 seconds total)
        false
      );

      // Pulse animation
      pulse.value = withRepeat(
        withTiming(1.15, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        2, // 2 cycles in 2 seconds
        true
      );

      // Pulsing rings
      ringScale1.value = withRepeat(
        withSequence(
          withTiming(1.3, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        1,
        false
      );

      ringScale2.value = withRepeat(
        withSequence(
          withDelay(200, withTiming(1.4, { duration: 1000 })),
          withTiming(1, { duration: 1000 })
        ),
        1,
        false
      );

      ringScale3.value = withRepeat(
        withSequence(
          withDelay(400, withTiming(1.5, { duration: 1000 })),
          withTiming(1, { duration: 1000 })
        ),
        1,
        false
      );

      // Auto-complete after 2 seconds
      setTimeout(() => {
        scale.value = withTiming(0, { duration: 200 });
        opacity.value = withTiming(0, { duration: 200 });
        setTimeout(onComplete, 250);
      }, 2000);
    } else {
      scale.value = 0;
      opacity.value = 0;
      rotation.value = 0;
      pulse.value = 1;
      ringScale1.value = 1;
      ringScale2.value = 1;
      ringScale3.value = 1;
    }
  }, [
    visible,
    scale,
    rotation,
    pulse,
    opacity,
    ringScale1,
    ringScale2,
    ringScale3,
    onComplete,
  ]);

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 360], [0, 360]);
    return {
      transform: [{ rotate: `${rotateValue}deg` }, { scale: pulse.value }],
    };
  });

  const ring1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: ringScale1.value }],
      opacity: interpolate(ringScale1.value, [1, 1.5], [0.8, 0]),
    };
  });

  const ring2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: ringScale2.value }],
      opacity: interpolate(ringScale2.value, [1, 1.5], [0.5, 0]),
    };
  });

  const ring3AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: ringScale3.value }],
      opacity: interpolate(ringScale3.value, [1, 1.5], [0.2, 0]),
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, modalAnimatedStyle]}>
          <View style={styles.contentContainer}>
            <View style={styles.iconContainer}>
              <Animated.View
                style={[styles.locationIconContainer, iconAnimatedStyle]}
              >
                <Ionicons name="location" size={64} color="#2DD4BF" />
              </Animated.View>

              {/* Pulsing rings */}
              <Animated.View
                style={[styles.pulseRing, styles.ring1, ring1AnimatedStyle]}
              />
              <Animated.View
                style={[styles.pulseRing, styles.ring2, ring2AnimatedStyle]}
              />
              <Animated.View
                style={[styles.pulseRing, styles.ring3, ring3AnimatedStyle]}
              />
            </View>

            <Text style={styles.title}>Verifying...</Text>
            <Text style={styles.subtitle}>Checking your location</Text>
            <Text style={styles.pleaseWait}>Please wait</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function withDelay(delay: number, animation: any) {
  "worklet";
  return withTiming(1, { duration: delay }, () => {
    return animation;
  });
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: "rgba(26, 31, 58, 0.95)",
    borderRadius: 24,
    padding: 40,
    minWidth: width * 0.8,
    maxWidth: width * 0.85,
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.3)",
    shadowColor: "#2DD4BF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  contentContainer: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 32,
    position: "relative",
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  locationIconContainer: {
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    borderRadius: 60,
    padding: 24,
    borderWidth: 3,
    borderColor: "rgba(45, 212, 191, 0.4)",
    zIndex: 10,
  },
  pulseRing: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(45, 212, 191, 0.4)",
    backgroundColor: "rgba(45, 212, 191, 0.05)",
  },
  ring1: {
    width: 100,
    height: 100,
  },
  ring2: {
    width: 130,
    height: 130,
  },
  ring3: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5EEAD4",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(147, 197, 253, 0.8)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  pleaseWait: {
    fontSize: 14,
    color: "rgba(147, 197, 253, 0.5)",
    textAlign: "center",
  },
});
