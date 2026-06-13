import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { TopbarNotifications } from "@/components/layout/TopbarNotifications";
import { TopbarUserMenu } from "@/components/layout/TopbarUserMenu";

interface TopbarShellProps {
  onOpenMobileSidebar: () => void;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  } | null;
}

export function TopbarShell({ onOpenMobileSidebar, user }: TopbarShellProps) {
  // console.log(user)
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobileSidebar}
        aria-label="Open menu"
      >
        <Menu />
      </Button>

      <div className="hidden md:block">
        <Breadcrumb />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex">
          <Search />
        </Button>
        <TopbarNotifications userId={user?._id} />
        <TopbarUserMenu user={user} />
      </div>
    </header>
  );
}
