import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { FaceVerificationResult } from "../../services/faceVerification";

interface FaceVerificationOverlayProps {
  visible: boolean;
  isProcessing: boolean;
  result: FaceVerificationResult | null;
  onClose: () => void;
  onRetry: () => void;
}

const { width } = Dimensions.get("window");

export default function FaceVerificationOverlay({
  visible,
  isProcessing,
  result,
  onClose,
  onRetry,
}: FaceVerificationOverlayProps) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0);

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

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: pulse.value }],
    };
  });

  const successIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          scale: withSpring(result?.success ? 1.1 : 1, {
            damping: 10,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const failureIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        {
          scale: withSpring(result?.success === false ? 1.1 : 1, {
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
        <Ionicons name="scan" size={48} color="#3B82F6" />
      </Animated.View>
      <Text style={styles.title}>Analyzing Face...</Text>
      <Text style={styles.subtitle}>
        AI is processing your facial features for verification
      </Text>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
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
      <Text style={[styles.title, styles.successTitle]}>
        Verification Successful!
      </Text>
      <Text style={styles.subtitle}>{result?.message}</Text>

      {result && (
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={styles.metricValue}>
              {(result.confidence * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Processing Time</Text>
            <Text style={styles.metricValue}>
              {(result.processingTime / 1000).toFixed(1)}s
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.successButton} onPress={onClose}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFailureState = () => (
    <View style={styles.contentContainer}>
      <Animated.View
        style={[
          styles.iconContainer,
          styles.failureIcon,
          failureIconAnimatedStyle,
        ]}
      >
        <Ionicons name="close-circle" size={64} color="#EF4444" />
      </Animated.View>
      <Text style={[styles.title, styles.failureTitle]}>
        Verification Failed
      </Text>
      <Text style={styles.subtitle}>{result?.message}</Text>

      {result && (
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Confidence</Text>
            <Text style={styles.metricValue}>
              {(result.confidence * 100).toFixed(1)}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Processing Time</Text>
            <Text style={styles.metricValue}>
              {(result.processingTime / 1000).toFixed(1)}s
            </Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => {
    if (isProcessing) {
      return renderProcessingState();
    }

    if (result?.success) {
      return renderSuccessState();
    }

    return renderFailureState();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, modalAnimatedStyle]}>
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
    paddingHorizontal: 24,
  },
  modal: {
    backgroundColor: "#1a1f3a",
    borderRadius: 20,
    padding: 32,
    minWidth: width * 0.85,
    maxWidth: width * 0.9,
    borderWidth: 1,
    borderColor: "rgba(96, 165, 250, 0.2)",
  },
  contentContainer: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  processingIcon: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: 50,
    padding: 16,
    borderWidth: 2,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  successIcon: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 50,
    padding: 12,
  },
  failureIcon: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 50,
    padding: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#93C5FD",
    marginBottom: 12,
    textAlign: "center",
  },
  successTitle: {
    color: "#10B981",
  },
  failureTitle: {
    color: "#EF4444",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(147, 197, 253, 0.7)",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 24,
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  metricsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  metricItem: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    color: "rgba(147, 197, 253, 0.6)",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#93C5FD",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  successButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 120,
  },
  retryButton: {
    flex: 1,
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  cancelButtonText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
