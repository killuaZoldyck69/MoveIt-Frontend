import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Confetti />
      <h1 className="text-4xl font-bold text-green-500 mb-4">
        Payment Successful!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your payment. Your parcel is now being processed.
      </p>
      <button
        onClick={() => navigate("/dashboard/my-parcels")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Go to My Parcels
      </button>
    </div>
  );
};

export default PaymentSuccess;
