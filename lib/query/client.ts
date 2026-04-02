import { QueryClient } from "@tanstack/react-query";

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false,
        staleTime: 30000,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
