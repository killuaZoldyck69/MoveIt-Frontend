import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const BookParcel = () => {
  const { user, setUser } = useAuth(); // Assuming setUser is available for state update
  const axiosSecure = useAxiosSecure();
  const notify = () => toast.success("Parcel Booked successfully");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: `${user?.displayName}`,
      email: `${user?.email}`,
      phoneNumber: user?.phoneNumber || "",
      parcelType: "",
      parcelWeight: "",
      receiverName: "",
      receiverPhone: "",
      deliveryAddress: "",
      requestedDeliveryDate: "",
      latitude: "",
      longitude: "",
    },
  });

  const parcelWeight = watch("parcelWeight");

  const calculatePrice = (weight) => {
    if (!weight) return 0;
    if (weight <= 1) return 50;
    if (weight <= 2) return 100;
    return 150;
  };

  const onSubmit = async (data) => {
    const price = calculatePrice(Number(data.parcelWeight));
    const bookingData = {
      ...data,
      price,
      status: "pending",
      bookingDate: new Date().toISOString(),
    };

    try {
      const response = await axiosSecure.post("/bookings", bookingData);

      if (response.data.insertedId) {
        console.log("Booking successful");
        notify();

        // Prepare user update payload
        const updatedUserData = {
          phoneNumber: user.phoneNumber || data.phoneNumber, // Add phone number if missing
          price, // Send only the price of the current booking
        };

        try {
          const userUpdateResponse = await axiosSecure.patch(
            `users/${user?.email}`,
            updatedUserData
          );

          if (userUpdateResponse.data.success) {
            console.log("User data updated successfully");
            setUser((prevUser) => ({
              ...prevUser,
              totalSpent: (prevUser?.totalSpent || 0) + price, // Update locally
              bookingCount: (prevUser?.bookingCount || 0) + 1,
            }));
          } else {
            console.error(
              "User update failed:",
              userUpdateResponse.data.message
            );
          }
        } catch (error) {
          console.error(
            "Error updating user:",
            error.response?.data || error.message
          );
        }
      }
    } catch (error) {
      console.error("Error booking parcel:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-10 shadow-2xl rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Book a Parcel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              {...register("name")}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              {...register("email")}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Phone Number</label>
            <input
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid phone number",
                },
              })}
              type="tel"
              className="w-full p-2 border rounded"
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">
                {errors.phoneNumber.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Parcel Type</label>
            <input
              {...register("parcelType", {
                required: "Parcel type is required",
              })}
              type="text"
              className="w-full p-2 border rounded"
            />
            {errors.parcelType && (
              <span className="text-red-500 text-sm">
                {errors.parcelType.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Parcel Weight (kg)</label>
            <input
              {...register("parcelWeight", { required: "Weight is required" })}
              type="number"
              step="0.1"
              className="w-full p-2 border rounded"
            />
            {errors.parcelWeight && (
              <span className="text-red-500 text-sm">
                {errors.parcelWeight.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Price (Tk)</label>
            <input
              value={calculatePrice(Number(parcelWeight))}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Receiver&apos;s Name</label>
            <input
              {...register("receiverName", {
                required: "Receiver's name is required",
              })}
              type="text"
              className="w-full p-2 border rounded"
            />
            {errors.receiverName && (
              <span className="text-red-500 text-sm">
                {errors.receiverName.message}
              </span>
            )}
          </div>
          <div>
            <label className="block mb-1">Receiver&apos;s Phone</label>
            <input
              {...register("receiverPhone", {
                required: "Receiver's phone is required",
              })}
              type="tel"
              className="w-full p-2 border rounded"
            />
            {errors.receiverPhone && (
              <span className="text-red-500 text-sm">
                {errors.receiverPhone.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1">Delivery Address</label>
          <textarea
            {...register("deliveryAddress", {
              required: "Delivery address is required",
            })}
            className="w-full p-2 border rounded"
          />
          {errors.deliveryAddress && (
            <span className="text-red-500 text-sm">
              {errors.deliveryAddress.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Latitude</label>
            <input
              {...register("latitude", {
                required: "Latitude is required",
                pattern: {
                  value: /^-?([0-8]?[0-9]|90)(\.[0-9]+)?$/,
                  message: "Please enter a valid latitude",
                },
              })}
              type="number"
              step="any"
              className="w-full p-2 border rounded"
            />
            {errors.latitude && (
              <span className="text-red-500 text-sm">
                {errors.latitude.message}
              </span>
            )}
          </div>

          <div>
            <label className="block mb-1">Longitude</label>
            <input
              {...register("longitude", {
                required: "Longitude is required",
                pattern: {
                  value: /^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]+)?$/,
                  message: "Please enter a valid longitude",
                },
              })}
              type="number"
              step="any"
              className="w-full p-2 border rounded"
            />
            {errors.longitude && (
              <span className="text-red-500 text-sm">
                {errors.longitude.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Delivery Date</label>
            <input
              {...register("requestedDeliveryDate", {
                required: "Delivery date is required",
              })}
              type="date"
              className="w-full p-2 border rounded"
            />
            {errors.requestedDeliveryDate && (
              <span className="text-red-500 text-sm">
                {errors.requestedDeliveryDate.message}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Book Parcel
        </button>
      </form>
    </div>
  );
};

export default BookParcel;
