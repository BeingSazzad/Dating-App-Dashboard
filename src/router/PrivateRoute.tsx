import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "@/components/ui/Spinner";
import { useGetProfileQuery } from "@/redux/apiSlices/authSlice";
export function PrivateRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
  } = useGetProfileQuery(null, {
    // skip: !token,
  });

  // useEffect(() => {
  //   if (isError) {
  //     toast.error("Please login again");
  //   }
  // }, [isError]);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isLoading || isFetching) {
    return <Spinner />;
  }

  if (isError || !profile?.data) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
