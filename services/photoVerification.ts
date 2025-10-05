export interface PhotoVerificationResult {
  verified: boolean;
  confidence: number;
  message: string;
  processingTime: number;
  matchDetails?: {
    similarity: number;
    objectsDetected: string[];
  };
}

/**
 * Simulates an LLM-powered photo verification service
 * In a real implementation, this would send the image to an AI service
 * to compare against a reference image or verify specific content
 */
export async function verifyPhotoWithLLM(
  imageUri: string
): Promise<PhotoVerificationResult> {
  // Simulate processing time (2-4 seconds like real AI services)
  const processingTime = Math.random() * 2000 + 2000;

  await new Promise((resolve) => setTimeout(resolve, processingTime));

  // Simulate LLM analysis with mostly successful results but some failures
  const verified = Math.random() > 0.2; // 80% success rate
  const confidence = verified
    ? Math.random() * 0.25 + 0.75 // 75-100% confidence for success
    : Math.random() * 0.45 + 0.15; // 15-60% confidence for failure

  const similarity = verified
    ? Math.random() * 0.2 + 0.8 // 80-100% similarity
    : Math.random() * 0.5 + 0.2; // 20-70% similarity

  // Simulated detected objects
  const possibleObjects = [
    "document",
    "person",
    "product",
    "location marker",
    "text",
    "barcode",
    "logo",
    "building",
    "equipment",
  ];

  const objectCount = Math.floor(Math.random() * 3) + 1;
  const objectsDetected = possibleObjects
    .sort(() => Math.random() - 0.5)
    .slice(0, objectCount);

  const messages = {
    success: [
      "Photo verification successful! Image matches the reference with high accuracy.",
      "Visual match confirmed. The captured photo meets all requirements.",
      "AI analysis complete. Photo verified successfully.",
      "Content verified. Image matches expected criteria.",
      "Photo validation passed. All visual elements confirmed.",
    ],
    failure: [
      "Photo verification failed. Image doesn't match the reference sufficiently.",
      "Unable to verify photo. Content doesn't meet the required criteria.",
      "Verification unsuccessful. Please ensure the photo captures the correct subject.",
      "Photo mismatch detected. Try capturing the image from a different angle.",
      "Verification failed. Lighting or focus issues detected in the image.",
    ],
  };

  const messageArray = verified ? messages.success : messages.failure;
  const message = messageArray[Math.floor(Math.random() * messageArray.length)];

  return {
    verified,
    confidence: Math.round(confidence * 100) / 100,
    message,
    processingTime: Math.round(processingTime),
    matchDetails: {
      similarity: Math.round(similarity * 100) / 100,
      objectsDetected,
    },
  };
}
