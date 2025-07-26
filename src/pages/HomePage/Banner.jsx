import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiSearch } from "react-icons/fi";
import bannerImg from "../../assets/7509757_3683230.jpg";

const Banner = () => {
  return (
    <div className="relative h-[70vh] md:h-[80vh] lg:min-h-[90vh] w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${bannerImg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/10" />

      {/* Content */}
      <div className="relative h-full container">
        <div className="flex flex-col justify-center h-full lg:h-fit space-y-6 max-w-3xl px-4 md:px-6 lg:px-16 py-12 md:py-20 lg:py-40">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Welcome to Our Platform
          </h1>

          <p className="text-base md:text-xl text-gray-200 max-w-xl">
            Discover amazing products and services tailored just for you. Start
            your journey with us today.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 w-full max-w-sm">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="w-full pl-10 bg-white/90 border-0 focus-visible:ring-2 focus-visible:ring-white text-base"
              />
            </div>
            <Button size="default" className="shrink-0">
              Search
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="w-full sm:w-auto text-base">
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base text-black hover:text-white border-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
