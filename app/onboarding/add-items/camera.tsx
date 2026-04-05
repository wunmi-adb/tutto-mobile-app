import {
  captureImage,
  getProcessingParams,
  requestCameraPermission,
} from "@/lib/utils/add-items-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Camera() {
  const router = useRouter();
  const { location, storageKey, source } = useLocalSearchParams<{
    location?: string;
    storageKey?: string;
    source?: string;
  }>();

  useEffect(() => {
    const openCamera = async () => {
      const granted = await requestCameraPermission();

      if (!granted) {
        router.back();
        return;
      }

      const result = await captureImage();
      const selectedAsset = result.assets?.[0];

      if (result.canceled || !selectedAsset) {
        router.back();
        return;
      }

      router.replace({
        pathname: "/onboarding/add-items/processing",
        params: getProcessingParams({
          location,
          photoUri: selectedAsset.uri,
          source,
          storageKey,
        }),
      });
    };

    void openCamera();
  }, [location, router, source, storageKey]);

  return <View style={{ flex: 1, backgroundColor: "#000000" }} />;
}
