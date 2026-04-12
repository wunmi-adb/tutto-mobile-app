import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ObsoleteAddItemDetailRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    source?: string;
  }>();
  const returnRoute = params.source === "pantry" ? "/dashboard/kitchen" : "/dashboard";

  useEffect(() => {
    router.replace(returnRoute);
  }, [returnRoute, router]);

  return null;
}
