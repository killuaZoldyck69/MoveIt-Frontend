/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Loading from "@/components/ui/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading></Loading>;
  if (user) return children;
  return <Navigate to="/login" state={location.pathname}></Navigate>;
};

export default PrivateRoute;
