import { Button } from "@headlessui/react";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-gray-600 mt-4">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>

      <img
        src="https://i.imgur.com/qIufhof.png"
        alt="Lost Astronaut"
        className="w-80 my-6"
      />

      <Link to="/">
        <Button className="flex items-center gap-2 bg-blue-700 rounded-md px-4 py-2 text-white">
          <FaHome />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default ErrorPage;
