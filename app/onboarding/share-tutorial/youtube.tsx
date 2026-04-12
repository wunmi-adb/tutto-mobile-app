import ShareTutorialPlatformScreen from "@/components/onboarding/share-tutorial/share-tutorial-platform-screen";
import { parseShareTutorialReturnTo } from "@/components/onboarding/share-tutorial/share-tutorial-config";
import { getSingleParamValue } from "@/lib/utils/search-params";
import { useLocalSearchParams } from "expo-router";

export default function YouTubeShareTutorialRoute() {
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const returnTo = parseShareTutorialReturnTo(getSingleParamValue(params.returnTo));

  return <ShareTutorialPlatformScreen platform="youtube" returnTo={returnTo} />;
}
