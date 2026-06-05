import { NavLink } from "react-router-dom";
import { navItems } from "@/config/navigation";
import { appConfig } from "@/config";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  onNavigate?: () => void;
}

/** Shared nav list used by both the desktop sidebar and the mobile drawer. */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted">
        Menu
      </p>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-accent/15 text-sidebar-accent"
                : "text-sidebar-foreground/80 hover:bg-white/5 hover:text-sidebar-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-accent" />
              )}
              <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {item.label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Logo light />
      </div>
      <SidebarNav />
      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs leading-relaxed text-sidebar-muted">
          {appConfig.tagline}
        </p>
      </div>
    </aside>
  );
}
