export interface FaceVerificationResult {
  success: boolean;
  confidence: number;
  message: string;
  processingTime: number;
}

/**
 * Simulates an LLM-powered face verification service
 * In a real implementation, this would send the image to an AI service
 */
export async function verifyFaceWithLLM(
  imageUri: string
): Promise<FaceVerificationResult> {
  // Simulate processing time (2-4 seconds like real AI services)
  const processingTime = Math.random() * 2000 + 2000;

  await new Promise((resolve) => setTimeout(resolve, processingTime));

  // Simulate LLM analysis with mostly successful results but some failures
  const success = Math.random() > 0.2; // 80% success rate
  const confidence = success
    ? Math.random() * 0.3 + 0.7 // 70-100% confidence for success
    : Math.random() * 0.5 + 0.1; // 10-60% confidence for failure

  const messages = {
    success: [
      "Face verification successful! Identity confirmed with high confidence.",
      "Biometric match found. Access granted.",
      "Face ID verification completed successfully.",
      "Identity verified. Facial features match registered profile.",
    ],
    failure: [
      "Face verification failed. Please ensure good lighting and face the camera directly.",
      "Unable to verify identity. Face not clearly visible or doesn't match records.",
      "Verification unsuccessful. Please try again with better positioning.",
      "Face ID mismatch detected. Access denied.",
    ],
  };

  const messageArray = success ? messages.success : messages.failure;
  const message = messageArray[Math.floor(Math.random() * messageArray.length)];

  return {
    success,
    confidence: Math.round(confidence * 100) / 100,
    message,
    processingTime: Math.round(processingTime),
  };
}

/**
 * Simulates additional face analysis metrics
 */
export function generateFaceAnalysisMetrics() {
  return {
    faceDetected: true,
    eyesOpen: Math.random() > 0.1,
    facingCamera: Math.random() > 0.15,
    lightingQuality: Math.random() > 0.2 ? "good" : "poor",
    imageQuality: Math.random() > 0.1 ? "high" : "low",
    spoofingDetection: Math.random() > 0.05 ? "real" : "suspicious",
  };
}
