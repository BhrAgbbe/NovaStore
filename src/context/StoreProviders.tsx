"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";
import { ToastProvider } from "@/shared/Toast";

export default function StoreProviders({ children }: { readonly children: ReactNode }) {
  const t = useTranslations("Store");
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            gcTime: 0,
            retry: false,
            retryOnMount: false,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={client}>
      <ToastProvider closeLabel={t("dismissToast")}>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
