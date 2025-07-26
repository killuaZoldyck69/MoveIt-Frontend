import { useState } from "react";
import { format } from "date-fns";
import { FaBox, FaSearch, FaUserCog } from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaVanShuttle } from "react-icons/fa6";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useDeliveryMen from "@/hooks/useDeliveryMen";
import useParcels from "@/hooks/useParcels";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

const AllParcels = () => {
  const axiosSecure = useAxiosSecure();
  const [filters, setFilters] = useState({ from: "", to: "" });
  const { parcels, refetch, parcelsLoading } = useParcels(filters);
  const { deliveryMen } = useDeliveryMen();

  // ✅ Add State to Control Dialog Open
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState(null);
  const [approxDeliveryDate, setApproxDeliveryDate] = useState("");

  // Handle search by date range
  const handleSearch = () => {
    if (!filters.from || !filters.to) {
      alert("Please select both dates for filtering.");
      return;
    }
    refetch();
  };

  // ✅ Function to open modal and set selected booking
  const handleManageClick = (parcel) => {
    setSelectedBooking(parcel);
    setIsDialogOpen(true); // Open the modal
  };

  // ✅ Function to assign a delivery man
  const assignDelivery = async () => {
    const notify = () => toast.success("DeliverMan assigned successfully");
    const notifyError = () => toast.error("Failed to assign");
    if (!selectedDeliveryMan || !approxDeliveryDate || !selectedBooking?._id) {
      return alert("Select all necessary fields.");
    }

    try {
      await axiosSecure.patch(`bookings/assign/${selectedBooking._id}`, {
        status: "On The Way",
        deliveryManId: selectedDeliveryMan,
        deliveryDate: approxDeliveryDate,
      });

      refetch();
      setIsDialogOpen(false); // Close the modal after success

      notify();
    } catch (error) {
      console.error("Error updating booking:", error);
      notifyError();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaBox /> All Parcels ({parcels.length})
      </h2>

      {/* Date Range Filter */}
      <div className="flex flex-col gap-4 mb-4 items-start">
        <h1 className="text-lg font-semibold">
          Search by requested delivery date
        </h1>
        <div className="flex gap-4">
          <input
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hidden text-white px-4 py-2 rounded md:flex items-center gap-2"
          >
            <FaSearch /> Search
          </button>
        </div>
      </div>

      {/* Parcels Table */}
      {parcelsLoading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block"
            role="status"
          >
            <Loader />
          </div>
        </div>
      ) : parcels.length === 0 ? (
        <p className="text-center text-gray-500">No parcels found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4 h-[70vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">User Name</th>
                <th className="p-2">User Phone</th>
                <th className="p-2">Booking Date</th>
                <th className="p-2">Requested Delivery Date</th>
                <th className="p-2">Cost</th>
                <th className="p-2">Status</th>
                <th className="p-2">Manage</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="border-t text-center">
                  <td className="p-2">{parcel.name}</td>
                  <td className="p-2">{parcel.phoneNumber}</td>
                  <td className="p-2">
                    {format(new Date(parcel.bookingDate), "yyyy-MM-dd")}
                  </td>
                  <td className="p-2">
                    {new Date(parcel.requestedDeliveryDate).toLocaleDateString(
                      "en-CA"
                    )}
                  </td>
                  <td className="p-2">৳ {parcel.price}</td>
                  <td
                    className={`flex items-center gap-2 justify-center p-2 ${
                      parcel.status === "pending"
                        ? "text-yellow-400"
                        : parcel.status === "On The Way"
                        ? "text-blue-400"
                        : parcel.status === "Delivered"
                        ? "text-green-400"
                        : parcel.status === "Cancelled"
                        ? "text-red-500"
                        : "" // Default case if none of the conditions match
                    }`}
                  >
                    {parcel.status === "pending" ? (
                      <MdOutlinePendingActions />
                    ) : parcel.status === "On The Way" ? (
                      <FaVanShuttle />
                    ) : parcel.status === "Delivered" ? (
                      <IoCheckmarkDoneCircleSharp />
                    ) : parcel.status === "Cancelled" ? (
                      <ImCross />
                    ) : (
                      ""
                    )}
                    {parcel.status}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleManageClick(parcel)}
                      className={`bg-green-500 text-white px-3 py-1 rounded flex items-center mx-auto gap-2 ${
                        parcel.status !== "pending" ? "bg-slate-500" : ""
                      }`}
                      disabled={parcel.status !== "pending"}
                    >
                      <FaUserCog /> Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Manage Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-6">
          <DialogTitle className="text-xl font-bold mb-4">
            Assign Delivery Man
          </DialogTitle>
          <p className="text-sm text-gray-500 mb-4">
            Please assign a delivery man and provide an approximate delivery
            date.
          </p>
          <div className="mt-4">
            <Select onValueChange={setSelectedDeliveryMan}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Delivery Man" />
              </SelectTrigger>
              <SelectContent>
                {deliveryMen.map((man) => (
                  <SelectItem key={man._id} value={man._id}>
                    {man.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <input
              type="date"
              className="border p-2 rounded w-full"
              onChange={(e) => setApproxDeliveryDate(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={assignDelivery}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Assign
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllParcels;
