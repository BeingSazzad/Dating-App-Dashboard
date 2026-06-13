import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { initials } from "@/lib/utils";
import { getImageUrl } from "@/utils/getImageUrl";

interface TopbarUserMenuProps {
  user?: {
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  } | null;
}

export function TopbarUserMenu({ user }: TopbarUserMenuProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="ml-1 flex items-center gap-2 rounded-full pl-1 pr-2 outline-none transition-colors hover:bg-accent">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getImageUrl(user?.image)} alt={user?.name} />
            <AvatarFallback>{initials(user?.name ?? "RA")}</AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-semibold leading-tight">
              {user?.name ?? "Admin"}
            </span>
            <span className="block text-xs capitalize text-muted-foreground">
              {user?.role?.replace("_", " ") ?? "admin"}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <User /> Profile &amp; settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleLogout}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
