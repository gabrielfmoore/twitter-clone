import QueryProvider from "@/providers/QueryProvider";
import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
