import { FaShieldAlt, FaBolt, FaMapMarkedAlt } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Features = () => {
  const featuresList = [
    {
      icon: <FaShieldAlt className="w-10 h-10 text-primary" />,
      title: "Parcel Safety",
      description:
        "Your packages are fully insured and handled with utmost care throughout the journey",
    },
    {
      icon: <FaBolt className="w-10 h-10 text-primary" />,
      title: "Super Fast Delivery",
      description:
        "Experience lightning-fast deliveries with our optimized routing system",
    },
    {
      icon: <FaMapMarkedAlt className="w-10 h-10 text-primary" />,
      title: "Real-Time Tracking",
      description:
        "Track your parcels in real-time with our advanced GPS tracking system",
    },
  ];

  return (
    <section className="py-16 px-4 container mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresList.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
