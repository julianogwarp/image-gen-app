"use client";
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let client: QueryClient | null = null;

function getClient() {
  if (!client) client = new QueryClient();
  return client;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [qc] = React.useState(() => getClient());
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
