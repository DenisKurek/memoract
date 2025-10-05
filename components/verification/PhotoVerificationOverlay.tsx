import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { PhotoVerificationResult } from "../../services/photoVerification";
import SuccessCheckmark from "../SuccessCheckmark";

interface PhotoVerificationOverlayProps {
  visible: boolean;
  result: PhotoVerificationResult | null;
  onComplete: () => void;
}

export default function PhotoVerificationOverlay({
  visible,
  result,
  onComplete,
}: PhotoVerificationOverlayProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const isProcessing = visible && !result;

  useEffect(() => {
    if (visible) {
      if (isProcessing) {
        setShowLoading(true);
        setShowSuccess(false);
      } else if (result) {
        setShowLoading(false);
        if (result.verified) {
          setShowSuccess(true);
        } else {
          // Show error for 2 seconds then close
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    } else {
      setShowLoading(false);
      setShowSuccess(false);
    }
  }, [visible, result, isProcessing, onComplete]);

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    onComplete();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        {showLoading && (
          <View style={styles.loadingContainer}>
            <Ionicons name="camera" size={64} color="#8a2be2" />
            <Text style={styles.loadingText}>Analyzing photo...</Text>
          </View>
        )}

        {result && !result.verified && (
          <View style={styles.errorContainer}>
            <View style={styles.errorCircle}>
              <Ionicons name="close" size={50} color="#fff" />
            </View>
            <Text style={styles.errorText}>Photos don&apos;t match</Text>
            <Text style={styles.errorSubtext}>
              Similarity: {result.matchDetails ? (result.matchDetails.similarity * 100).toFixed(0) : '0'}%
            </Text>
          </View>
        )}

        <SuccessCheckmark visible={showSuccess} onComplete={handleSuccessComplete} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
  },
  errorContainer: {
    alignItems: "center",
    gap: 16,
  },
  errorCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  errorText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: "#aaa",
  },
});
