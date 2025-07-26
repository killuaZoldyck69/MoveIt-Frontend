import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useDeliveryMen = () => {
  const axiosSecure = useAxiosSecure();

  const { data: deliveryMen = [], isLoading: deliveryMenLoading } = useQuery({
    queryKey: ["deliveryMen"],
    queryFn: async () => {
      const res = await axiosSecure.get("deliverymen");
      return res.data;
    },
    enabled: true, // Always enabled
  });

  return { deliveryMen, deliveryMenLoading };
};

export default useDeliveryMen;
