import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { useGetProfileQuery } from "@/redux/apiSlices/authSlice";

export function PrivateRoute() {
  const location = useLocation();

  const {
    data: profile,
    isLoading,
    isFetching,
  } = useGetProfileQuery(undefined);





  if (isLoading || isFetching) {
    return <Spinner />;
  }

  if (!profile?.data) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
