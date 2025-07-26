import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Input } from "../../../components/ui/input";
import {
  FaUser,
  FaCamera,
  FaUserTag,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import moment from "moment"; // For formatting date
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import Swal from "sweetalert2";

const imagebb_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const imagebb_hosting_api = `https://api.imgbb.com/1/upload?key=${imagebb_hosting_key}`;

const MyProfile = () => {
  const { user, profileUpdate, loading, setLoading } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(user?.photoURL || "");
  const [imageFile, setImageFile] = useState(null);
  const [User, setUser] = useState(null);
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosSecure.get(
          `users/find?email=${user?.email}`
        );
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user?.email]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Show preview
  };

  const handleUpdateProfile = async () => {
    if (!imageFile) {
      Swal.fire({
        icon: "warning",
        title: "No Image Selected",
        text: "Please select an image before updating.",
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const { data } = await axiosPublic.post(imagebb_hosting_api, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        const imageUrl = data.data.display_url;
        setPreviewUrl(imageUrl); // Update preview with the new URL

        const updatedUser = { photoURL: imageUrl };

        const res = await axiosSecure.patch(
          `users/update-photo/${user?.email}`,
          updatedUser
        );

        if (res.data.success) {
          await profileUpdate({ photoURL: imageUrl });
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Profile Picture Updated",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        console.error("Image upload failed:", data);
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Something went wrong while uploading the image.",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating the profile picture.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="w-32 h-32 object-cover">
                <AvatarImage src={previewUrl} />
                <AvatarFallback>
                  <FaUser className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <FaCamera className="w-5 h-5 text-white" />
              </label>
              <Input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* User Info */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{user?.displayName}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            {/* Update Profile Button */}
            <Button onClick={handleUpdateProfile} className="w-full max-w-xs">
              {loading ? "Updating..." : "Update Profile Picture"}
            </Button>

            {/* User Details Section */}
            <div className="w-full max-w-md space-y-4">
              {/* User Type */}
              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-md">
                <FaUserTag className="text-lg text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    User Type
                  </p>
                  <p className="text-md font-medium">
                    {User?.userType || "N/A"}
                  </p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-md">
                <FaPhone className="text-lg text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Phone Number
                  </p>
                  <p className="text-md font-medium">
                    {User?.phoneNumber || "No Phone Number"}
                  </p>
                </div>
              </div>

              {/* Account Created At */}
              <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-md">
                <FaCalendarAlt className="text-lg text-gray-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Account Created At
                  </p>
                  <p className="text-md font-medium">
                    {User?.createdAt
                      ? moment(User.createdAt).format("MMMM Do, YYYY, h:mm a")
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyProfile;
