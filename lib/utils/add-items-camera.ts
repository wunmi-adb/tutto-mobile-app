import * as ImagePicker from "expo-image-picker";

export function getProcessingParams({
  location,
  photoUri,
  source,
  storageKey,
}: {
  location?: string;
  photoUri: string;
  source?: string;
  storageKey?: string;
}) {
  return {
    photoUri,
    type: "image" as const,
    ...(location ? { location } : {}),
    ...(storageKey ? { storageKey } : {}),
    ...(source ? { source } : {}),
  };
}

export async function requestCameraPermission() {
  const { granted } = await ImagePicker.requestCameraPermissionsAsync();
  return granted;
}

export async function captureImage() {
  return ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.85,
  });
}
