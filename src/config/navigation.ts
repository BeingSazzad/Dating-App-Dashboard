import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldAlert,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Users", to: "/users", icon: Users },
  { label: "Reports", to: "/reports", icon: ShieldAlert },
  { label: "Subscriptions", to: "/subscriptions", icon: CreditCard },
  { label: "Settings", to: "/settings", icon: Settings },
];
