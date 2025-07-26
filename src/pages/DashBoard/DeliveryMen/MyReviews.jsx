import { useEffect, useState } from "react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns"; // For formatting review dates
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Loader } from "lucide-react";

const MyReviews = () => {
  const { user, dataLoading, setDataLoading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [User, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);

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

    const fetchReviews = async () => {
      try {
        if (User?._id) {
          const response = await axiosSecure.get(
            `reviews?deliveryManId=${User._id}`
          );
          setReviews(response.data);
          setDataLoading(false);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [User?._id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaStar></FaStar> My Reviews
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
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review._id} className="shadow-lg">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-20 h-20 object-cover">
                  <AvatarImage src={review.userImage} alt={review.userName} />
                </Avatar>
                <div className="space-y-1">
                  <CardTitle>{review.userName}</CardTitle>
                  <p className="font-medium">{review.userEmail}</p>
                  <p className="text-gray-500 text-sm">
                    {format(new Date(review.reviewDate), "PPPPp")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }, (_, i) => {
                    const ratingValue = parseFloat(review.rating); // Convert to number
                    if (i < Math.floor(ratingValue)) {
                      return (
                        <FaStar key={i} className="w-4 h-4 text-yellow-500" />
                      );
                    } else if (
                      i === Math.floor(ratingValue) &&
                      ratingValue % 1 !== 0
                    ) {
                      return (
                        <FaStarHalfAlt
                          key={i}
                          className="w-4 h-4 text-yellow-500"
                        />
                      );
                    } else {
                      return (
                        <FaRegStar key={i} className="w-4 h-4 text-gray-300" />
                      );
                    }
                  })}
                  <span className="ml-2 text-gray-600">{review.rating}/5</span>
                </div>
                <p className="text-gray-700">{review.feedback}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;
