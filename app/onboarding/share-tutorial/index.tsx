import ShareTutorialSelectionScreen from "@/components/onboarding/share-tutorial/share-tutorial-selection-screen";
import { parseShareTutorialReturnTo } from "@/components/onboarding/share-tutorial/share-tutorial-config";
import { getSingleParamValue } from "@/lib/utils/search-params";
import { useLocalSearchParams } from "expo-router";

export default function ShareTutorialIndexRoute() {
  const params = useLocalSearchParams<{ returnTo?: string | string[] }>();
  const returnTo = parseShareTutorialReturnTo(getSingleParamValue(params.returnTo));

  return <ShareTutorialSelectionScreen returnTo={returnTo} />;
}
