import { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { MdCancel, MdReviews, MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import { FaBoxOpen } from "react-icons/fa6";
import { Loader } from "lucide-react";

const MyParcel = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const { user, dataLoading, setDataLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParcelId, setCurrentParcelId] = useState(null);
  const [reviewData, setReviewData] = useState({
    userName: user.displayName || "Anonymous",
    userImage: user.photoURL || "/path/to/default-avatar.jpg",
    userEmail: user.email,
    bookingId: currentParcelId,
    reviewDate: new Date().toISOString(),
    rating: 0,
    feedback: "",
    deliveryManId: "",
  });
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    setDataLoading(true); // Set loading to true before fetching data
    const fetchParcels = async () => {
      const response = await axiosSecure.get(`bookings?email=${user.email}`);
      setParcels(response.data);
      setFilteredParcels(response.data);
      setDataLoading(false); // Set loading to false after data is fetched
    };
    fetchParcels();
  }, [user.email]);

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    if (value === "all") {
      setFilteredParcels(parcels);
    } else {
      setFilteredParcels(parcels.filter((parcel) => parcel.status === value));
    }
  };

  useEffect(() => {
    handleStatusFilter(statusFilter);
  }, [parcels]);

  const handleUpdate = (id) => {
    navigate(`/dashboard/update-parcel/${id}`);
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this booking?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      await axiosSecure.patch(`bookings/status/${id}`, { status: "Cancelled" });
      const updatedParcels = parcels.map((parcel) =>
        parcel._id === id ? { ...parcel, status: "Cancelled" } : parcel
      );
      setParcels(updatedParcels);
      setFilteredParcels(updatedParcels);
      Swal.fire("Canceled!", "Your booking has been cancelled.", "success");
    }
  };

  const handleReviewSubmit = async () => {
    try {
      // Submit the review
      await axiosSecure.post("reviews", reviewData);

      // Fetch all reviews for this delivery man
      const { data: reviews } = await axiosSecure.get(
        `reviews?deliveryManId=${reviewData.deliveryManId}`
      );

      // Calculate the new average rating
      const totalReviews = reviews.length;
      const avgRating =
        totalReviews > 0
          ? reviews.reduce(
              (sum, review) => sum + parseFloat(review.rating),
              0
            ) / totalReviews
          : reviewData.rating; // If it's the first review, use the given rating

      // Update the delivery man data with the new average rating as a number
      await axiosSecure.patch(`deliveryMen/${reviewData.deliveryManId}`, {
        avgRating: Number(avgRating.toFixed(2)), // Convert to a proper number
        totalReviews,
      });

      Swal.fire("Success!", "Your review has been submitted.", "success");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      Swal.fire(
        "Error!",
        "There was an issue submitting your review.",
        "error"
      );
    }
  };

  const handleReviewClick = (parcelId, deliveryManId) => {
    setCurrentParcelId(parcelId);
    setReviewData({ ...reviewData, deliveryManId });
    setIsModalOpen(true);
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FaBoxOpen></FaBoxOpen> My Parcels ({parcels.length})
        </h2>
        <Select onValueChange={handleStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="On The Way">On the way</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
        <p className="text-center text-gray-500">No parcels found.</p>
      ) : (
        <Table className="border-2">
          <TableHeader>
            <TableRow className="bg-gray-300">
              <TableHead className="text-black font-bold text-base text-center">
                Parcel Type
              </TableHead>
              <TableHead className="text-black font-bold text-base text-center">
                Requested Delivery Date
              </TableHead>
              <TableHead className="text-black font-bold text-base text-center">
                Approximate Delivery Date
              </TableHead>
              <TableHead className="text-black font-bold text-base text-center">
                Booking Date
              </TableHead>
              <TableHead className="text-black font-bold text-base text-center">
                Delivery Men ID
              </TableHead>
              <TableHead className="text-black font-bold text-base text-center">
                Status
              </TableHead>
              <TableHead className="text-black font-bold text-base text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredParcels.map((parcel) => (
              <TableRow key={parcel._id} className="text-base text-center">
                <TableCell className="w-40">{parcel.parcelType}</TableCell>
                <TableCell>
                  {new Date(parcel.requestedDeliveryDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {parcel.deliveryDate
                    ? new Date(parcel.deliveryDate).toLocaleDateString()
                    : "Not set"}
                </TableCell>
                <TableCell>
                  {new Date(parcel.bookingDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{parcel.deliveryManId || "Not assigned"}</TableCell>
                <TableCell
                  className={
                    parcel.status === "pending"
                      ? "text-yellow-400"
                      : parcel.status === "On The Way"
                      ? "text-blue-400"
                      : parcel.status === "Delivered"
                      ? "text-green-400"
                      : parcel.status === "Cancelled"
                      ? "text-red-500"
                      : ""
                  }
                >
                  {parcel.status}
                </TableCell>
                <TableCell className="space-x-2 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleUpdate(parcel._id)}
                    disabled={parcel.status !== "pending"}
                  >
                    <FaEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCancel(parcel._id)}
                    disabled={parcel.status !== "pending"}
                  >
                    <MdCancel className="h-4 w-4" />
                  </Button>
                  {parcel.status === "Delivered" && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        handleReviewClick(parcel._id, parcel.deliveryManId)
                      }
                    >
                      <MdReviews className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={parcel.status === "Cancelled"}
                    onClick={() => navigate(`/dashboard/payment/${parcel._id}`)}
                  >
                    <MdPayment className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h2 className="text-2xl font-bold mb-4">Submit Review</h2>
            <div className="flex flex-col space-y-4">
              <img
                src={reviewData.userImage}
                alt="User Image"
                className="w-16 h-16 rounded-full mx-auto"
              />
              <div className="flex items-center gap-4">
                <label className="font-semibold">Your Name</label>
                <input
                  value={reviewData.userName}
                  disabled
                  className="border p-2 rounded"
                  placeholder="Your Name"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="font-semibold">Your Email</label>
                <input
                  value={reviewData.userEmail}
                  disabled
                  className="border p-2 rounded "
                  placeholder="Your Name"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="w-1/2 font-semibold">Delivery Men ID </label>
                <input
                  value={reviewData.deliveryManId}
                  disabled
                  className="border p-2 rounded w-full"
                  placeholder="Delivery Man's ID"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="font-semibold">Rating (Out of 5)</label>
                <input
                  type="number"
                  value={reviewData.rating}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, rating: e.target.value })
                  }
                  min="1"
                  max="5"
                  className="border p-2 rounded"
                />
              </div>
              <textarea
                value={reviewData.feedback}
                onChange={(e) =>
                  setReviewData({ ...reviewData, feedback: e.target.value })
                }
                className="border p-2 rounded"
                placeholder="Your feedback"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button onClick={handleReviewSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyParcel;
