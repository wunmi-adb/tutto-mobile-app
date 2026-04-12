import type { Href } from "expo-router";

export function getStorageSuccessHref(location: string, count: number, source?: string) {
  const params = new URLSearchParams({
    location,
    count: String(count),
  });

  if (source) {
    params.set("source", source);
  }

  return `/onboarding/storage/success?${params.toString()}` as Href;
}
