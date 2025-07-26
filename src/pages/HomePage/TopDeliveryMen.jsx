import { useEffect, useState } from "react";
import { FaBox, FaPhone, FaStar } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const TopDeliveryMen = () => {
  const axiosPublic = useAxiosPublic();
  const [topDeliveryMen, setTopDeliveryMen] = useState([]);

  useEffect(() => {
    const fetchTopDeliveryMen = async () => {
      try {
        const response = await axiosPublic.get("/delivery-men/top");
        setTopDeliveryMen(response.data);
      } catch (error) {
        console.error("Error fetching top delivery men:", error);
      }
    };

    fetchTopDeliveryMen();
  }, []);

  return (
    <div className="py-16 px-4 container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Top Delivery Men</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topDeliveryMen.map((man) => (
          <Card key={man._id} className="shadow-md hover:shadow-lg transition">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-28 h-28 object-cover border border-gray-300 shadow-lg">
                <AvatarImage src={man?.photoURL} alt={man?.name} />
                <AvatarFallback>{man?.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-2 text-lg font-semibold">
                {man?.name}
              </CardTitle>
              <p className="text-gray-600 font-medium">{man?.email}</p>
              <p className="flex items-center gap-3 text-gray-600 font-medium">
                <FaPhone></FaPhone> {man?.phoneNumber}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FaBox className="text-blue-500" />
                <span>{man?.deliveryCount} Parcels Delivered</span>
              </div>
              <div className="flex items-center gap-2 text-yellow-500">
                <FaStar />
                <span className="font-semibold">
                  {man?.avgRating?.toFixed(1)} / 5 Avg. Rating
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopDeliveryMen;
