import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Logo } from "@/components/layout/Logo";
import { SidebarNav } from "@/components/layout/Sidebar";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent side="left" className="bg-sidebar p-0" hideClose>
        <DrawerTitle>Navigation</DrawerTitle>
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Logo light />
        </div>
        <SidebarNav onNavigate={() => onOpenChange(false)} />
      </DrawerContent>
    </Drawer>
  );
}
