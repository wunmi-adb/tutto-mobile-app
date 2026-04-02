import BackButton from "@/components/ui/BackButton";
import { useNavigation } from "expo-router";

export default function OnboardingBackButton() {
  const navigation = useNavigation();

  if (!navigation.canGoBack()) {
    return null;
  }

  return <BackButton onPress={() => navigation.goBack()} />;
}
