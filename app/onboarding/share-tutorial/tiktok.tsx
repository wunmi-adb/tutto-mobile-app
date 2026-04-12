import ShareTutorialPlatformScreen from "@/components/onboarding/share-tutorial/share-tutorial-platform-screen";
import { getSingleParamValue } from "@/lib/utils/search-params";
import { useLocalSearchParams } from "expo-router";

export default function TikTokShareTutorialRoute() {
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const returnTo = getSingleParamValue(params.returnTo);

  return <ShareTutorialPlatformScreen platform="tiktok" returnTo={returnTo} />;
}
