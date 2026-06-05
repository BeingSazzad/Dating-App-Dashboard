import { useAppSelector } from "@/store/hooks";

/** Convenience selector for the authenticated admin + auth status. */
export function useAuth() {
  const { user, token } = useAppSelector((s) => s.auth);
  return { user, token, isAuthenticated: Boolean(token) };
}
