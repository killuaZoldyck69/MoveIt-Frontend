import axios from "axios";

const instance = axios.create({
  baseURL: "https://moveit-server-site.vercel.app/",
});

const useAxiosPublic = () => {
  return instance;
};

export default useAxiosPublic;
