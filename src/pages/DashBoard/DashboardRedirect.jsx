import { Spinner } from "@/components/ui/spinner";
import useType from "@/hooks/useType";
// import MyProfile from "./User/MyProfile";
// import Statistics from "./Admin/Statistics";
// import MyDeliveryList from "./DeliveryMen/MyDeliveryList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const DashboardRedirect = () => {
  const [userType, userTypeLoading] = useType();
  const navigate = useNavigate();

  useEffect(() => {
    if (userTypeLoading) return; // Wait until loading is done

    if (!userType) {
      navigate("/login"); // Redirect to login if no user type
      return;
    }

    // Redirect based on role
    switch (userType) {
      case "admin":
        navigate("/dashboard/statistics");
        break;
      case "deliveryMan":
        navigate("/dashboard/delivery-list");
        break;
      default:
        navigate("/dashboard/my-profile");
    }
  }, [userType, userTypeLoading, navigate]);

  if (userTypeLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );

  return <div>Redirecting...</div>; // Avoid returning null to prevent rendering issues
};

export default DashboardRedirect;
