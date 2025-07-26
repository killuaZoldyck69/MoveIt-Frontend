import { useEffect } from "react";
import Banner from "./Banner";
import Features from "./Features";
import Statistics from "./Statistics";
import TopDeliveryMen from "./TopDeliveryMen";
import Aos from "aos";

const HomePage = () => {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <div>
      <Banner></Banner>
      <div data-aos="fade-down">
        <Features></Features>
      </div>
      <div data-aos="fade-up">
        <Statistics></Statistics>
      </div>
      <div data-aos="fade-right">
        <TopDeliveryMen></TopDeliveryMen>
      </div>
    </div>
  );
};

export default HomePage;
