import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEye, FaTrashAlt, FaCheckCircle, FaListAlt } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import LocationModal from "./LocationModal";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Loader } from "lucide-react";

const MyDeliveryList = () => {
  const { user, dataLoading, setDataLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [User, setUser] = useState(null);
  const [parcels, setParcels] = useState([]);

  // Location modal state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user?.email) {
          const res = await axiosSecure.get(`users/find?email=${user.email}`);
          setUser(res.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user?.email]);

  useEffect(() => {
    setDataLoading(true);
    const fetchParcels = async () => {
      try {
        if (User?._id) {
          const res = await axiosSecure.get(
            `delivery-list?deliveryManId=${User._id}`
          );
          if (Array.isArray(res.data)) {
            setParcels(res.data);
          } else {
            console.error("API response is not an array:", res.data);
            setParcels([]);
          }
          setDataLoading(false);
        }
      } catch (error) {
        console.error("Error fetching parcels:", error);
      }
    };

    fetchParcels();
  }, [User?._id]);

  const handleCancel = async (id) => {
    console.log("Cancelling parcel:", id);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Once cancelled, you cannot undo this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`bookings/status/${id}`, {
          status: "Cancelled",
        });
        if (res.data.success) {
          Swal.fire("Cancelled!", "The parcel has been cancelled.", "success");
          setParcels((prevParcels) =>
            prevParcels.map((parcel) =>
              parcel._id === id ? { ...parcel, status: "Cancelled" } : parcel
            )
          );
        } else {
          Swal.fire("Error", "Failed to cancel the parcel.", "error");
        }
      } catch (error) {
        console.error("Error cancelling parcel:", error);
        Swal.fire("Error", "Something went wrong.", "error");
      }
    }
  };

  const handleDeliver = async (id, deliveryManId) => {
    Swal.fire({
      title: "Confirm Delivery?",
      text: "Mark this parcel as delivered?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Deliver it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Update the parcel status to "Delivered"
          await axiosSecure.patch(`bookings/status/${id}`, {
            status: "Delivered",
          });

          // Fetch the deliveryMan's current data
          const { data: deliveryMan } = await axiosSecure.get(
            `users/find?id=${deliveryManId}`
          );

          // Calculate new delivery count
          const newDeliveryCount = (deliveryMan.deliveryCount || 0) + 1;

          // Update the deliveryMan with new delivery count
          await axiosSecure.patch(`deliveryMen/${deliveryManId}`, {
            deliveryCount: newDeliveryCount,
          });

          // Update local state
          setParcels(
            parcels.map((parcel) =>
              parcel._id === id ? { ...parcel, status: "Delivered" } : parcel
            )
          );

          Swal.fire("Success", "Parcel delivered successfully!", "success");
        } catch (error) {
          console.error("Error delivering parcel:", error);
          Swal.fire("Error", "Error delivering parcel", "error");
        }
      }
    });
  };

  const handleViewLocation = (parcel) => {
    if (parcel.latitude && parcel.longitude) {
      setSelectedLocation({
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        address: parcel.receiverAddress,
      });
      setIsLocationModalOpen(true);
    } else {
      Swal.fire("Info", "Location data not available.", "info");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaListAlt></FaListAlt> My Delivery List
      </h2>
      {dataLoading ? (
        <div className="flex justify-center items-center">
          <div
            className="spinner-border animate-spin inline-block"
            role="status"
          >
            <Loader />
          </div>
        </div>
      ) : parcels.length === 0 ? (
        <p className="text-gray-500">No delivery found.</p>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-300">
              <tr>
                <th className="border px-4 py-2">Booked User&apos;s Name</th>
                <th className="border px-4 py-2">Receiver&apos;s Name</th>
                <th className="border px-4 py-2">Booked User&apos;s Phone</th>
                <th className="border px-4 py-2">Requested Delivery Date</th>
                <th className="border px-4 py-2">Approximate Delivery Date</th>
                <th className="border px-4 py-2">Receiver&apos;s Phone</th>
                <th className="border px-4 py-2">Receiver&apos;s Address</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr key={parcel._id} className="text-center">
                  <td className="border px-4 py-2">{parcel.bookedUserName}</td>
                  <td className="border px-4 py-2">{parcel.receiverName}</td>
                  <td className="border px-4 py-2">{parcel.bookedUserPhone}</td>
                  <td className="border px-4 py-2">
                    {new Date(
                      parcel.requestedDeliveryDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(
                      parcel.approximateDeliveryDate
                    ).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{parcel.receiverPhone}</td>
                  <td className="border px-4 py-2">{parcel.receiverAddress}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    {/* View Location Button */}
                    <Button
                      variant="outline"
                      onClick={() => handleViewLocation(parcel)}
                    >
                      <FaEye /> View Location
                    </Button>

                    {parcel.status !== "Cancelled" && (
                      <>
                        {/* Cancel Button */}
                        <Button
                          variant="destructive"
                          onClick={() => handleCancel(parcel._id)}
                          className={parcel.status === "Delivered" && "hidden"}
                        >
                          <FaTrashAlt /> Cancel
                        </Button>

                        {/* Deliver Button */}
                        <Button
                          variant="success"
                          onClick={() =>
                            handleDeliver(parcel._id, parcel.deliveryManId)
                          }
                          className={parcel.status === "Delivered" && "hidden"}
                        >
                          <FaCheckCircle /> Deliver
                        </Button>
                      </>
                    )}

                    {parcel.status === "Delivered" ? (
                      <span className="text-green-600 flex items-center">
                        Delivered
                      </span>
                    ) : parcel.status === "Cancelled" ? (
                      <span className="text-red-500 flex items-center">
                        Cancelled
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        latitude={selectedLocation.latitude}
        longitude={selectedLocation.longitude}
        address={selectedLocation.address}
      />
    </div>
  );
};

export default MyDeliveryList;
