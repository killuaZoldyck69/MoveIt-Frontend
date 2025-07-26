import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../../assets/register.jpg";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { FaPhone } from "react-icons/fa"; // Import phone icon
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const Register = () => {
  const [userType, setUserType] = useState("user");
  const { createUser, profileUpdate, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const notify = () => toast.success("Registration successful");
  const axiosPublic = useAxiosPublic();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        // console.log(result.user);
        profileUpdate({
          displayName: data.name,
          photoURL: data.photoUrl,
        })
          .then(() => {
            console.log("profile updated");
            const userInfo = {
              name: data.name,
              email: data.email,
              photoURL: data.photoUrl,
              phoneNumber: data.phoneNumber, // Add phone number to user info
              userType: data.userType || "user",
              createdAt: new Date(),
            };

            axiosPublic.post("users", userInfo).then((res) => {
              if (res.data.insertedId) {
                notify();
                navigate("/");
              }
            });
          })
          .catch((error) => {
            console.log(error, "error");
            toast.error("Registration failed");
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message || "Registration failed");
      });
  };

  const handleLoginWithGoogle = () => {
    loginWithGoogle()
      .then((result) => {
        const userInfo = {
          name: result.user?.displayName,
          email: result.user?.email,
          photoURL: result.user?.photoURL,
          phoneNumber: result.user?.phoneNumber || "", // Add phone number (if available from Google)
          userType: "user",
          createdAt: new Date(),
        };

        axiosPublic
          .post("users", userInfo)
          .then((res) => {
            console.log(res.data);
            toast.success("Google sign-in successful!");
            navigate("/");
          })
          .catch((error) => {
            console.log("Error saving user:", error);
            toast.error("Registration failed");
          });
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message || "Google sign-in failed");
      });
  };

  return (
    <div className="my-10 bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-11/12  lg:w-4/6">
        <div className="grid md:grid-cols-2 items-center gap-0">
          {/* Form Side */}
          <div className="">
            <CardHeader className="">
              <CardTitle className="text-xl sm:text-2xl font-bold text-center md:text-left">
                Create an Account
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name field */}
                <div className="relative">
                  <Input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    placeholder="Full Name"
                    className="w-full"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Photo URL field */}
                <div className="relative">
                  <Input
                    type="url"
                    {...register("photoUrl", {
                      required: "Photo URL is required",
                    })}
                    placeholder="Photo URL"
                    className="w-full"
                  />
                  {errors.photoUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.photoUrl.message}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div className="relative">
                  <MdEmail className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="Email"
                    className="pl-10"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone Number field */}
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="tel"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    placeholder="Phone Number (11 digits)"
                    className="pl-10"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Password field */}
                <div className="relative">
                  <RiLockPasswordLine className="absolute left-3 top-3 text-gray-400" />
                  <Input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^[A-Za-z0-9]\w{6,14}$/,
                        message:
                          " Add at least one uppercase letter, one lowercase letter, one number",
                      },
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Password"
                    className="pl-10"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* User Type Selection */}
                <div className="relative">
                  <select
                    {...register("userType")}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    onChange={(e) => setUserType(e.target.value)}
                    value={userType}
                  >
                    <option value="user">User</option>
                    <option value="deliveryMan">Delivery Man</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Register
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleLoginWithGoogle}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Register with Google
                </Button>

                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-600 hover:underline">
                    Login here
                  </Link>
                </p>
              </form>
            </CardContent>
          </div>

          {/* Image Side */}
          <div className="hidden md:block h-full p-4 sm:p-6">
            <img
              src={registerImg || "/placeholder.svg"}
              alt="Register"
              className="h-full w-full object-cover rounded-r-lg"
              style={{ maxHeight: "600px" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;
