import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import loginImg from "../../assets/login-2.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const Login = () => {
  const { loginUser, loginWithGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = () => toast.success("Login successful");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    loginUser(data.email, data.password)
      .then((result) => {
        // console.log(result.user);
        notify();
        navigate(location.state || "/");
        // Remove toast, success will redirect automatically
      })
      .catch((error) => {
        setError("root", {
          type: "manual",
          message: error.message,
        });
      });
  };

  const handleGoogleLogin = () => {
    // Add your Google login logic here
    loginWithGoogle()
      // .then((result) => {
      //   console.log(result.user);
      //   notify();
      //   navigate(location.state || "/");
      // })
      // .catch((error) => {
      //   console.log(error);
      // });
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
      <Card className="w-11/12 lg:w-4/6">
        <div className="grid md:grid-cols-2 items-center gap-0">
          {/* Login Form Side */}
          <div>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl font-bold text-center md:text-left">
                Welcome back
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <MdEmail className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email"
                      className="pl-10"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <RiLockPasswordLine className="absolute left-3 top-3 text-gray-400" />
                    <Input
                      type="password"
                      placeholder="Password"
                      className="pl-10"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {errors.password && (
                      <span className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add root error display */}
                {errors.root && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.root.message}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  Login
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
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className="mr-2 h-5 w-5" />
                  Login with Google
                </Button>

                <p className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:underline"
                  >
                    Register here
                  </Link>
                </p>
              </form>
            </CardContent>
          </div>

          {/* Image Side */}
          <div className="hidden md:block h-full p-4 sm:p-6">
            <img
              src={loginImg}
              alt="Login"
              className="h-full w-full object-cover rounded-r-lg"
              style={{ maxHeight: "600px" }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
