import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { QrCodeVerificationResult } from "../../services/qrCodeVerification";

interface QrCodeVerificationOverlayProps {
  visible: boolean;
  result: QrCodeVerificationResult | null;
  onComplete: () => void;
}

const { width } = Dimensions.get("window");

export default function QrCodeVerificationOverlay({
  visible,
  result,
  onComplete,
}: QrCodeVerificationOverlayProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0);

  const isProcessing = visible && !result;

  useEffect(() => {
    if (visible) {
      // Scale in animation with bounce
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

      if (isProcessing) {
        // Continuous rotation for processing
        rotation.value = withRepeat(
          withTiming(360, {
            duration: 2000,
            easing: Easing.linear,
          }),
          -1,
          false
        );

        // Pulse animation for processing
        pulse.value = withRepeat(
          withTiming(1.2, {
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true
        );
      } else {
        // Stop animations when not processing
        rotation.value = withTiming(0, { duration: 300 });
        pulse.value = withTiming(1, { duration: 300 });
      }
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      rotation.value = 0;
      pulse.value = 1;
    }
  }, [visible, isProcessing, scale, rotation, pulse, opacity]);

  // Auto-complete after showing result for 2 seconds
  useEffect(() => {
    if (result && visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [result, visible, onComplete]);

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const processingIconAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(rotation.value, [0, 360], [0, 360]);
    return {
      transform: [{ rotate: `${rotateValue}deg` }, { scale: pulse.value }],
    };
  });

  const successIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          scale: withSpring(result?.verified ? 1.1 : 1, {
            damping: 10,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const renderProcessingState = () => (
    <View style={styles.contentContainer}>
      <Animated.View
        style={[
          styles.iconContainer,
          styles.processingIcon,
          processingIconAnimatedStyle,
        ]}
      >
        <Ionicons name="qr-code" size={48} color="#9333EA" />
      </Animated.View>

      <Text style={styles.title}>Scanning QR Code</Text>
      <Text style={styles.subtitle}>Verifying QR code data...</Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[styles.progressFill, { backgroundColor: "#9333EA" }]}
          />
        </View>
      </View>
    </View>
  );

  const renderSuccessState = () => (
    <View style={styles.contentContainer}>
      <Animated.View
        style={[
          styles.iconContainer,
          styles.successIcon,
          successIconAnimatedStyle,
        ]}
      >
        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
      </Animated.View>

      <Text style={styles.title}>QR Code Verified!</Text>
      <Text style={styles.subtitle}>{result?.message}</Text>

      {result?.qrData && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailLabel}>QR Code Data:</Text>
          <Text
            style={styles.qrDataText}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {result.qrData}
          </Text>
        </View>
      )}
    </View>
  );

  const renderContent = () => {
    if (isProcessing) {
      return renderProcessingState();
    }

    if (result?.verified) {
      return renderSuccessState();
    }

    return null;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onComplete}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContent, modalAnimatedStyle]}>
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    padding: 32,
    width: width - 48,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  contentContainer: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  processingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(147, 51, 234, 0.3)",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(148, 163, 184, 0.8)",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  progressContainer: {
    width: "100%",
    marginTop: 8,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(147, 51, 234, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "100%",
    borderRadius: 2,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: "rgba(148, 163, 184, 0.7)",
    fontWeight: "500",
    marginBottom: 8,
  },
  qrDataText: {
    fontSize: 13,
    color: "#F1F5F9",
    fontWeight: "600",
    fontFamily: "monospace",
  },
});
