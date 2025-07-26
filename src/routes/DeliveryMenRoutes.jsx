/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import Loading from "@/components/ui/Loading";
import useAuth from "@/hooks/useAuth";
import useType from "@/hooks/useType";
import { Navigate, useLocation } from "react-router-dom";

const DeliveryMenRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const [userType, userTypeLoading] = useType();
  const location = useLocation();

  if (loading || userTypeLoading) return <Loading></Loading>;
  if (user && userType === "deliveryMan") {
    return children;
  }
  return <Navigate state={location.pathname} to={"/login"}></Navigate>;
};

export default DeliveryMenRoutes;
