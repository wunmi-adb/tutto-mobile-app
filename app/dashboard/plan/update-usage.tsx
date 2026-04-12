import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function PlanUpdateUsageRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    origin?: "plan" | "recipes";
  }>();
  const returnRoute = params.origin === "recipes" ? "/dashboard/recipes" : "/dashboard/plan";

  useEffect(() => {
    router.replace(returnRoute);
  }, [returnRoute, router]);

  return null;
}
