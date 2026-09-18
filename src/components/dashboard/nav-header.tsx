import Logo from "@/components/common/logo";
import { H2 } from "@/components/ui/typography";
import Link from "next/link";

export function NavHeader() {
  return (
    <Link
      href="/"
      aria-label="ClassMate - Go to landing page"
      className="flex h-full w-full items-center gap-2.5 pl-2 group-data-[collapsible=icon]:pl-0 transition-normal duration-200"
    >
      <Logo />
      <H2
        render={
          <span className="truncate group-data-[collapsible=icon]:hidden" />
        }
      >
        ClassMate
      </H2>
    </Link>
  );
}
