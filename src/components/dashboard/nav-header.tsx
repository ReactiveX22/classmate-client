import Logo from "@/components/common/logo";
import { Typography } from "@/components/ui/typography";

export function NavHeader() {
  return (
    <div className="flex h-full w-full items-center gap-3">
      <Logo />
      <Typography
        variant="h2"
        render={
          <span className="truncate group-data-[collapsible=icon]:hidden" />
        }
      >
        ClassMate
      </Typography>
    </div>
  );
}