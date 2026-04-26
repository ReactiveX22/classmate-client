"use client";

import { useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export function ImpersonationBanner() {
  const { data: session, isPending } = useSession();
  const [isLoading, setIsLoading] = useState(false);

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
        window.location.href = "/dashboard";
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
    <div className="sticky top-0 z-[100] flex w-full items-center justify-center gap-4 bg-rose-500/85 px-4 py-2 text-sm font-medium text-white shadow-md">
      <span className="flex items-center gap-2">
        Logged in as
        <span className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
          </Avatar>
          <strong>{session?.user?.name}</strong>
        </span>
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleExit}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <X />}
        Exit
      </Button>
    </div>
  );
}
