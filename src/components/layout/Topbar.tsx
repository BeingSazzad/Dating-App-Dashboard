import { useGetProfileQuery } from "@/redux/apiSlices/authSlice";
import { TopbarShell } from "@/components/layout/TopbarShell";

interface TopbarProps {
  onOpenMobileSidebar: () => void;
}

export function Topbar({ onOpenMobileSidebar }: TopbarProps) {
  const { data: profileRes } = useGetProfileQuery(undefined);
  const user = profileRes?.data;

  return <TopbarShell onOpenMobileSidebar={onOpenMobileSidebar} user={user} />;
}
