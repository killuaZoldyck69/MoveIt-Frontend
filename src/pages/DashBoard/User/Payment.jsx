import { Elements } from "@stripe/react-stripe-js";
import CheckOutForm from "./CheckOutForm";
import { loadStripe } from "@stripe/stripe-js";
import { FaMoneyBill } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_Gateway_PK);
const Payment = () => {
  return (
    <div className="w-3/4 mx-auto h-screen  flex flex-col justify-center">
      <h1 className="text-[40px] mb-16 text-center font-bold flex items-center justify-center gap-2">
        <FaMoneyBill></FaMoneyBill> PAYMENT
      </h1>
      <div>
        <Elements stripe={stripePromise}>
          <CheckOutForm></CheckOutForm>
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
