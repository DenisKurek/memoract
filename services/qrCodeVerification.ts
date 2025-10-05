export interface QrCodeVerificationResult {
  verified: boolean;
  qrData: string;
  message: string;
  processingTime: number;
}

/**
 * Simulates QR code verification service
 * Always returns true if a QR code is detected
 */
export async function verifyQrCodeWithLLM(
  qrData: string
): Promise<QrCodeVerificationResult> {
  // Simulate processing time (1-2 seconds)
  const processingTime = Math.random() * 1000 + 1000;

  await new Promise((resolve) => setTimeout(resolve, processingTime));

  // Always verify as true if QR code data exists
  const verified = !!(qrData && qrData.length > 0);

  const messages = {
    success: [
      "QR code verified successfully!",
      "QR code scanned and validated.",
      "Verification complete. QR code is valid.",
      "QR code authenticated successfully.",
    ],
    failure: [
      "QR code verification failed. No valid data found.",
      "Unable to verify QR code. Please try again.",
    ],
  };

  const messageArray = verified ? messages.success : messages.failure;
  const message = messageArray[Math.floor(Math.random() * messageArray.length)];

  return {
    verified,
    qrData,
    message,
    processingTime: Math.round(processingTime),
  };
}
