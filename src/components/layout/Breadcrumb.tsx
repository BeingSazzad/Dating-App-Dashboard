import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { navItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  "": "Dashboard",
  users: "Users",
  subscriptions: "Subscriptions",
  cms: "CMS",
  settings: "Settings",
};

export function Breadcrumb() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [
    { label: "Dashboard", to: "/" },
    ...segments.map((seg, i) => {
      const to = "/" + segments.slice(0, i + 1).join("/");
      const known = navItems.find((n) => n.to === to);
      const label =
        known?.label ??
        LABELS[seg] ??
        (seg.startsWith("usr_") ? "User Details" : seg);
      return { label, to };
    }),
  ];

  // Drop duplicate leading "Dashboard" when already at root
  const items = pathname === "/" ? [crumbs[0]] : crumbs;

  return (
    <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={c.to} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            {last ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link
                to={c.to}
                className={cn("text-muted-foreground transition-colors hover:text-foreground")}
              >
                {c.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
