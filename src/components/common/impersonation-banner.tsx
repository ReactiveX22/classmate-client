"use client";

import { useSession } from "@/lib/auth-client";
import { Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

export function ImpersonationBanner() {
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (isPending) return null;

  // The session object from better-auth contains 'impersonatedBy' if active.
  const impersonatedBy = session?.session?.impersonatedBy;

  if (!impersonatedBy) return null;

  const handleExit = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/v1/impersonation/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        },
      );

      if (res.ok) {
        // Hard refresh to clear client-side state and reload with the original admin session
        window.location.href = "/";
      } else {
        console.error("Failed to stop impersonation");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-4 bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-md">
      <span>
        You are currently impersonating <strong>{session?.user?.name}</strong>
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleExit}
        disabled={isLoading}
        className="h-8 shadow-sm"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Exit Impersonation
      </Button>
    </div>
  );
}
