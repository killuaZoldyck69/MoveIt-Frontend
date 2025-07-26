import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  // Create an axios instance
  const instance = axios.create({
    baseURL: "https://moveit-server-site.vercel.app/", // Base URL for your API
  });

  // Add request interceptor for attaching the authorization token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      } else {
        console.warn("No access token found in localStorage");
      }
      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor for handling errors like 401 or 403
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response) {
        const status = error.response.status;

        if (status === 401 || status === 403) {
          console.warn(
            `Error ${status}: Unauthorized or forbidden. Signing out user.`
          );
          await logoutUser();
          navigate("/login"); // Redirect to sign-in page
        }
      } else {
        console.error("Network or server error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxiosSecure;
