import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { FaUsers, FaUserShield } from "react-icons/fa";
import { FaPersonCircleCheck } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Loader } from "lucide-react";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const {
    data: users = [],
    isLoading: usersLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("users");
      return res.data;
    },
  });

  const handleMakeDeliveryMan = async (user) => {
    console.log(user);

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to make ${user.name} a delivery man?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, make delivery man!",
      });

      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`users/delivery-man/${user._id}`);
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire(
            "Updated!",
            `${user.name} is now a delivery man`,
            "success"
          );
        }
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to update user role",
        "error"
      );
    }
  };

  const handleMakeAdmin = async (user) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you want to make ${user.name} an admin?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, make admin!",
      });

      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`users/admin/${user._id}`);
        if (res.data.modifiedCount > 0) {
          refetch();
          Swal.fire("Updated!", `${user.name} is now an admin`, "success");
        }
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire(
        "Error!",
        error.response?.data?.message || "Failed to update user role",
        "error"
      );
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaUsers></FaUsers> All Users ({users.length})
      </h2>

      {usersLoading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block"
            role="status"
          >
            <Loader />
          </div>
        </div>
      ) : (
        <div className="rounded-md border overflow-auto lg:overflow-visible">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="bg-gray-300">
                <TableHead className="text-black font-bold text-base text-center">
                  Name
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Phone Number
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Parcels Booked
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Total Spent
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Make Delivery Man
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Make Admin
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user._id} className="text-base text-center">
                  <TableCell className="flex items-center justify-center gap-3">
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-10 h-10 object-cover rounded-full"
                    />{" "}
                    {user.name}
                  </TableCell>
                  <TableCell>{user.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{user.bookingCount || 0}</TableCell>
                  <TableCell>
                    ৳ {user.totalSpent?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell>
                    {user.userType !== "deliveryMan" ? (
                      <Button
                        onClick={() => handleMakeDeliveryMan(user)}
                        disabled={
                          user.userType === "admin" ||
                          user.userType === "deliveryMan"
                        }
                        variant="outline"
                        size="md"
                        className="p-2"
                      >
                        <FaPersonCircleCheck className="mr-2" />
                        Make Delivery Man
                      </Button>
                    ) : (
                      <p className="flex items-center font-bold bg-yellow-300 w-fit px-5 py-2 border border-black rounded-md mx-auto">
                        <FaPersonCircleCheck className="mr-2" /> Delivery Man
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.userType !== "admin" ? (
                      <Button
                        onClick={() => handleMakeAdmin(user)}
                        disabled={user.userType === "admin"}
                        variant="outline"
                        className="p-2"
                        size="md"
                      >
                        <FaUserShield className="mr-2" />
                        Make Admin
                      </Button>
                    ) : (
                      <p className="font-bold flex items-center bg-orange-500 w-fit px-5 py-2 border border-black rounded-md mx-auto">
                        <FaUserShield className="mr-2" /> Admin
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination className="mt-4 hover:cursor-pointer">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AllUsers;
