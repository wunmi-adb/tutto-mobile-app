import { QueryClientProvider, focusManager } from "@tanstack/react-query";
import { type ReactNode, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { createQueryClient } from "@/lib/query/client";
import { AuthProvider } from "@/providers/AuthProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  useEffect(() => {
    if (Platform.OS === "web") {
      return;
    }

    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}
