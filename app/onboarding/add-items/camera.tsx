import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function Camera() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        router.back();
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.85,
      });

      if (result.canceled || !result.assets[0]) {
        router.back();
      } else {
        router.replace({
          pathname: "/onboarding/add-items/processing",
          params: { photoUri: result.assets[0].uri },
        });
      }
    })();
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: "#000000" }} />;
}
