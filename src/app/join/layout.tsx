"use client";

import { Providers } from "@/lib/providers/QueryProvider";

export default function JoinLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Providers>{children}</Providers>;
}
