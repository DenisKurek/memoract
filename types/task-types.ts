import { Ionicons } from "@expo/vector-icons";

export enum CompletionMethodType {
  QR_CODE = "qr",
  GEOLOCATION = "geo",
  PHOTO = "photo",
  FACE_ID = "face",
}

export interface CompletionMethod {
  label: string;
  value: CompletionMethodType;
  icon: keyof typeof Ionicons.glyphMap;
}

export const completionMethods: CompletionMethod[] = [
  {
    label: "Scan QR Code",
    value: CompletionMethodType.QR_CODE,
    icon: "qr-code-outline",
  },
  {
    label: "Use Geolocation",
    value: CompletionMethodType.GEOLOCATION,
    icon: "location-outline",
  },
  {
    label: "Add Photo",
    value: CompletionMethodType.PHOTO,
    icon: "camera-outline",
  },
  {
    label: "Face ID",
    value: CompletionMethodType.FACE_ID,
    icon: "scan-outline",
  },
];

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  datetime: string;
  completionMethod: CompletionMethodType;
  completed: boolean;
  // Additional data based on completion method
  qrCode?: string; // For QR_CODE: generated QR code data
  location?: LocationData; // For GEOLOCATION: lat/lng
  photoUri?: string; // For PHOTO: reference photo URI
  faceData?: string; // For FACE_ID: encoded face data
}
