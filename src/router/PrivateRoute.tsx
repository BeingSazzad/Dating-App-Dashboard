import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { useGetProfileQuery } from "@/redux/apiSlices/authSlice";
import { toast } from "sonner";

export function PrivateRoute() {
  const location = useLocation();
  const { data: profile, isLoading, isFetching, isError } = useGetProfileQuery(null, {
    skip: !localStorage.getItem("token"),
  });
  // console.log(profile)
  if (isLoading || isFetching) {
    return <Spinner />;
  }
  if (isError || !profile?.data) {
    if (isError) {
      // console.log(isError)
      toast.error("Something went wrong");
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
