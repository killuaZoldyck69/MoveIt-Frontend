import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useParcels = (filters = {}) => {
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    refetch,
  } = useQuery({
    queryKey: ["parcels", filters], // Ensure re-fetching when filters change
    queryFn: async () => {
      const { from, to } = filters;
      const url = from && to ? `bookings/?from=${from}&to=${to}` : "bookings";
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  return { parcels, parcelsLoading, refetch };
};

export default useParcels;
