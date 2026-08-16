import Logo from "@/components/common/logo";
import { H2 } from "@/components/ui/typography";

export function NavHeader() {
  return (
    <div className="flex h-full w-full items-center gap-2.5 pl-2 group-data-[collapsible=icon]:pl-0 transition-normal duration-200">
      <Logo />
      <H2
        render={
          <span className="truncate group-data-[collapsible=icon]:hidden" />
        }
      >
        ClassMate
      </H2>
    </div>
  );
}
