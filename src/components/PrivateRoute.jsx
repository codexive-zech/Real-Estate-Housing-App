import { Navigate, Outlet } from "react-router-dom";
import { useAuthUser } from "../hooks/useAuthUser";

const PrivateRoute = () => {
  const { userLoggedIn, checkLoadingStatus } = useAuthUser();

  if (checkLoadingStatus) {
    return <h1>Loading</h1>;
  }

  return userLoggedIn ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
