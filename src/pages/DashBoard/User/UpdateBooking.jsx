import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import useAxiosPublic from "@/hooks/useAxiosPublic";

const UpdateBooking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  // const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const notify = () => toast.success("Parcel Updated successfully");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

  // Fetch existing booking data
  const [isFetched, setIsFetched] = useState(false); // Add a flag to track if data is fetched

  useEffect(() => {
    if (!isFetched) {
      axiosSecure
        .get(`bookings?id=${id}`)
        .then((response) => {
          const booking = response.data;
          console.log("Booking fetched:", booking);

          // Populate the form only once when data is fetched
          Object.keys(booking).forEach((key) => {
            if (key !== "_id" && getValues(key) !== booking[key]) {
              setValue(key, booking[key]);
            }
          });

          setIsFetched(true); // Mark as fetched to prevent overwriting user changes
        })
        .catch((error) => {
          console.error("Error fetching booking data:", error);
        });
    }
  }, [id, setValue, axiosSecure, getValues, isFetched]);

  // Watch parcel weight for price calculation
  const parcelWeight = watch("parcelWeight");

  // Calculate price based on weight
  const calculatePrice = (weight) => {
    if (!weight) return 0;
    if (weight <= 1) return 50;
    if (weight <= 2) return 100;
    return 150;
  };

  const onSubmit = (data) => {
    const price = calculatePrice(Number(data.parcelWeight));
    const bookingData = {
      ...data,
      price,
      status: "pending",
    };

    axiosSecure
      .put(`bookings/${id}`, bookingData)
      .then((response) => {
        if (response.data.modifiedCount > 0) {
          notify();
          navigate("/dashboard/my-parcels");
        }
      })
      .catch((error) => {
        console.error("Error updating parcel:", error);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-10 shadow-2xl rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">Update Parcel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Read-only fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Name</label>
            <input
              {...register("name")}
              value={user?.displayName}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              {...register("email")}
              value={user?.email}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>
        {/* User input fields */}
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

        {/* Weight and Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Parcel Weight (kg)</label>
            <input
              {...register("parcelWeight", {
                required: "Weight is required",
                min: { value: 0.1, message: "Weight must be greater than 0" },
              })}
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

        {/* Receiver information */}
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
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Please enter a valid phone number",
                },
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

        {/* Delivery details */}
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

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Update Parcel
        </button>
      </form>
    </div>
  );
};

export default UpdateBooking;
