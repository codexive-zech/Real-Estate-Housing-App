import { Navigate, Outlet } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";
import { Spinner } from ".";

const PrivateRoute = () => {
  const { userLoggedIn, checkLoadingStatus } = useAuthUser();

  if (checkLoadingStatus) {
    return <Spinner />;
  }

  return userLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
