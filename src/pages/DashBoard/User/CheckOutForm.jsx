import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [clientSecret, setClientSecret] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const params = useParams();
  const [parcel, setParcel] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.get(`bookings/${params.id}`).then((res) => {
      setParcel(res.data);
    });
  }, []);

  const totalPrice = parcel?.price;

  useEffect(() => {
    if (totalPrice > 0) {
      axiosSecure
        .post("create-payment-intent", { price: totalPrice })
        .then((res) => {
          // console.log(res.data.clientSecret);
          setClientSecret(res.data.clientSecret);
        });
    }
  }, [totalPrice]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("payment error", error);
      setError(error.message);
    } else {
      console.log("payment method", paymentMethod);
      setError("");
    }

    // confirm payment
    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            email: user?.email || "anonymous",
            name: user?.displayName || "anonymous",
          },
        },
      });

    if (confirmError) {
      console.log("confirm error");
    } else {
      console.log("payment intent", paymentIntent);

      if (paymentIntent.status === "succeeded") {
        console.log("transaction id", paymentIntent.id);
        setTransactionId(paymentIntent.id);
      }
    }

    // now save the payment in the database
    const payment = {
      email: user.email,
      price: totalPrice,
      transactionId: paymentIntent.id,
      date: new Date(), // utc date convert. use moment js to
      bookingId: parcel._id,
      deliveryStatus: parcel.status,
    };

    const res = await axiosSecure.post("payments", payment);
    console.log("payment saved", res.data);
    if (res.data?.paymentResult?.insertedId) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Thank you for your payment",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect to PaymentSuccess page
      navigate("/dashboard/payment-success");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        className="border-2 p-5"
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />
      <div className="text-center mt-16">
        <button
          className="inter-font px-48 py-5 btn text-white font-bold text-xl bg-blue-700 "
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Pay
        </button>
        <p className="text-red-600">{error}</p>
        {transactionId && (
          <p className="text-green-600">Your transaction id: {transactionId}</p>
        )}
      </div>
    </form>
  );
};

export default CheckOutForm;
