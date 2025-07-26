import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaBars, FaHome, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // Importing the hamburger menu icon
import { BellIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import useAuth from "@/hooks/useAuth";
import { MdSpaceDashboard } from "react-icons/md";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notify = () => {
    toast.error("Logout successfully");
  };

  const handleLogout = () => {
    logoutUser().then(() => {
      notify();
      console.log("Logout successfully");
    });
  };

  return (
    <div>
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo + Website Name */}
          <div className="flex items-center space-x-3">
            <img src={logoImg} alt="MoveIt Logo" className="w-14 h-14" />
            <span className="text-2xl font-bold">MoveIt</span>
          </div>

          {/* Navbar Links for Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Home Link */}
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>

            {/* Notification Icon */}
            <div className="relative">
              <BellIcon className="w-6 h-6 text-white hover:text-gray-300" />
              {/* Badge */}
              <span className="absolute top-0 right-0 text-xs text-red-500 bg-white rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </div>

            {/* Login Button / Profile Picture */}
            {!user ? (
              <Link to="/login">
                <Button className="bg-green-500 hover:bg-green-600 ">
                  Login
                </Button>
              </Link>
            ) : (
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger>
                  <img
                    src={user?.photoURL}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="absolute right-4 mt-2 bg-white rounded-lg shadow-lg p-2 z-10">
                  <div className="space-y-1">
                    <div className="text-base font-semibold text-black">
                      {user?.displayName}
                    </div>
                    <div className="text-sm font-semibold text-gray-600">
                      {user?.email}
                    </div>
                  </div>
                  <hr className="border border-[#577BC1] my-2" />
                  <div className="space-y-1 mt-2">
                    <Link to="/dashboard">
                      <DropdownMenuItem className="flex items-center gap-2 text-gray-700  hover:bg-[#FFEB00] rounded-md hover:px-5 cursor-pointer">
                        <MdSpaceDashboard />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-gray-700 hover:bg-[#FFEB00] rounded-md hover:px-5  cursor-pointer"
                    >
                      <FaSignOutAlt></FaSignOutAlt> Logout
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Button with Dropdown */}
          <div className="md:hidden flex items-center z-50">
            {/* Show mobile menu if not logged in */}
            {!user && (
              <DropdownMenu
                open={isMobileMenuOpen}
                onOpenChange={setIsMobileMenuOpen} // Handle opening and closing of the menu
              >
                <DropdownMenuTrigger>
                  <FaBars className="w-6 h-6 text-white cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="top"
                  className="absolute top-16 right-4 bg-white shadow-md rounded-md px-5 py-3"
                >
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-black py-2"
                  >
                    <FaHome /> Home
                  </Link>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-black py-2"
                  >
                    <FaSignInAlt /> Login
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Profile Dropdown for Logged In User */}
            {user && (
              <DropdownMenu
                open={isMobileMenuOpen}
                onOpenChange={setIsMobileMenuOpen} // Handle opening and closing of the menu
              >
                <DropdownMenuTrigger>
                  <img
                    src={user?.photoURL}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  side="top"
                  className="absolute top-16 right-4 bg-white shadow-md rounded-md px-5 py-3"
                >
                  <div className="text-base font-semibold text-black">
                    {user?.displayName}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {user?.email}
                  </div>
                  <hr className="border border-[#577BC1] my-2" />
                  <Link to="/dashboard">
                    <DropdownMenuItem className="flex items-center gap-2 text-gray-700 hover:bg-[#FFEB00] rounded-md hover:px-5 cursor-pointer">
                      <MdSpaceDashboard />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-700 hover:bg-[#FFEB00] rounded-md hover:px-5 cursor-pointer"
                  >
                    <FaSignOutAlt></FaSignOutAlt> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
