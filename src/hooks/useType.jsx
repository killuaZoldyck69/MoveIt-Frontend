import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useType = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userType, isPending: userTypeLoading } = useQuery({
    queryKey: [user?.email, "userType"],
    queryFn: async () => {
      if (!user?.email) return null; // Avoid API call if no user is logged in

      const res = await axiosSecure.get(`/users/type/${user.email}`);
      console.log("User Type:", res.data?.userType);
      return res.data?.userType; // Return correct property
    },
    enabled: !!user?.email, // Ensures the query runs only when user is available
  });

  return [userType, userTypeLoading];
};

export default useType;
