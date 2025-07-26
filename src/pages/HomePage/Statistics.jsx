import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Card, CardContent } from "@/components/ui/card";
import { FaBox, FaTruck, FaUsers } from "react-icons/fa";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const Statistics = () => {
  const axiosPublic = useAxiosPublic();
  const [stats, setStats] = useState({
    parcelsBooked: 0,
    parcelsDelivered: 0,
    registeredUsers: 0,
  });

  // Fetch statistics from the database
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosPublic.get("statistics");
        setStats({
          parcelsBooked: data.parcelsBooked || 0,
          parcelsDelivered: data.parcelsDelivered || 0,
          registeredUsers: data.registeredUsers || 0,
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStats();
  }, []);

  // Card data with dynamic values
  const statsData = [
    {
      icon: <FaBox className="w-8 h-8 text-primary" />,
      value: stats.parcelsBooked,
      label: "Parcels Booked",
    },
    {
      icon: <FaTruck className="w-8 h-8 text-primary" />,
      value: stats.parcelsDelivered,
      label: "Parcels Delivered",
    },
    {
      icon: <FaUsers className="w-8 h-8 text-primary" />,
      value: stats.registeredUsers,
      label: "Registered Users",
    },
  ];

  return (
    <section className="py-16 px-4 container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Our Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow text-center"
          >
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">
                  <CountUp end={stat.value} duration={2.5} separator="," />
                </h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Statistics;
