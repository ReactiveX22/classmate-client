import { Button } from "@/components/ui/button";
import { IconHome, IconLayoutDashboard } from "@tabler/icons-react";
import Link from "next/link";

const BUTTON_CLASS = "w-full rounded-xl px-6 sm:w-48";

/**
 * Escape routes for the 404 page. Deliberately static — no session lookup,
 * no loading states, nothing to flash or shift.
 *
 * Both destinations self-correct through the auth middleware (proxy.ts):
 * logged-out visitors hitting Dashboard land on login, logged-in users
 * hitting login land on the dashboard. No dead ends either way.
 */
export function NotFoundActions() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          size="lg"
          variant="outline"
          className={BUTTON_CLASS}
          nativeButton={false}
          render={
            <Link href="/">
              <IconHome /> Back to Home
            </Link>
          }
        />
        <Button
          size="lg"
          className={BUTTON_CLASS}
          nativeButton={false}
          render={
            <Link href="/dashboard">
              <IconLayoutDashboard /> Go to Dashboard
            </Link>
          }
        />
      </div>
    </div>
  );
}
