import DashBoard from "@/pages/DashBoard/DashBoard";
import { Outlet } from "react-router-dom";

const DashBoardLayout = () => {
  return (
    <div className="flex">
      <DashBoard></DashBoard>
      <div className="lg:w-4/5 md:w-[72%]  w-11/12 mx-auto mt-16 md:mt-0">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default DashBoardLayout;
