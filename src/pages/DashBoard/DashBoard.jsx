import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FaBars,
  FaTimes,
  FaBox,
  FaUser,
  FaUsers,
  FaTruck,
  FaChartBar,
  FaClipboardList,
  FaComments,
  FaBoxOpen,
  FaHome,
  FaHistory,
} from "react-icons/fa";
import useType from "@/hooks/useType";
import { MdSpaceDashboard } from "react-icons/md";

const DashBoard = () => {
  const [userType] = useType(); // Get userType
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  const userMenus = [
    { to: "/dashboard/my-profile", label: "My Profile", icon: <FaUser /> },
    { to: "/dashboard/book-parcel", label: "Book a Parcel", icon: <FaBox /> },
    { to: "/dashboard/my-parcels", label: "My Parcels", icon: <FaBoxOpen /> },
    {
      to: "/dashboard/my-payments",
      label: "My Payment History",
      icon: <FaHistory />,
    },
  ];

  const deliveryManMenus = [
    {
      to: "/dashboard/delivery-list",
      label: "My Delivery List",
      icon: <FaClipboardList />,
    },
    { to: "/dashboard/reviews", label: "My Reviews", icon: <FaComments /> },
    { to: "/dashboard/my-profile", label: "My Profile", icon: <FaUser /> },
  ];

  const adminMenus = [
    { to: "/dashboard/statistics", label: "Statistics", icon: <FaChartBar /> },
    { to: "/dashboard/all-parcels", label: "All Parcels", icon: <FaBox /> },
    { to: "/dashboard/all-users", label: "All Users", icon: <FaUsers /> },
    {
      to: "/dashboard/all-delivery-men",
      label: "All Delivery Men",
      icon: <FaTruck />,
    },
    { to: "/dashboard/my-profile", label: "My Profile", icon: <FaUser /> },
  ];

  const getMenus = () => {
    const commonMenus = [{ to: "/", label: "Home", icon: <FaHome /> }];
    switch (userType) {
      case "user":
        return [...userMenus, ...commonMenus];
      case "deliveryMan":
        return [...deliveryManMenus, ...commonMenus];
      case "admin":
        return [...adminMenus, ...commonMenus];
      default:
        return commonMenus;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 🟢 Mobile Sidebar Toggle Button */}
      <button
        className="absolute top-4 left-4 text-2xl md:hidden bg-blue-700 text-white p-2 rounded-md"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars />
      </button>

      {/* 🟢 Sidebar - Always Visible on PC & Hidden in Mobile */}
      <div
        className={`bg-blue-700 text-white border-r border-gray-200 fixed inset-y-0 left-0 w-52 
        transition-transform duration-300 ease-in-out z-50 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex md:flex-col md:w-48 lg:w-64`}
      >
        {/* 🟢 Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-600">
          <h1 className="flex items-center gap-2 text-xl font-semibold">
            <MdSpaceDashboard />
            Dashboard
          </h1>
          {/* 🟢 Close Button for Mobile */}
          <button
            className="md:hidden text-2xl bg-red-500 p-1 rounded-md"
            onClick={() => setIsSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* 🟢 Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {getMenus().map((menu, index) => (
            <NavLink
              key={index}
              to={menu.to}
              className={({ isActive }) =>
                isActive
                  ? "w-full flex items-center bg-white text-black rounded-md py-1"
                  : "w-full flex items-center"
              }
            >
              <Button variant="ghost" className="w-full justify-start gap-2">
                {menu.icon}
                {menu.label}
              </Button>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DashBoard;
