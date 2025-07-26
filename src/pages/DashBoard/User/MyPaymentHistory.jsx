import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import moment from "moment";
import useAuth from "@/hooks/useAuth";
import { FaHistory } from "react-icons/fa";
import { Loader } from "lucide-react";

const MyPaymentHistory = () => {
  const { user, dataLoading, setDataLoading } = useAuth();
  const [payments, setPayments] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    setDataLoading(true);
    const fetchPayments = async () => {
      try {
        const { data } = await axiosSecure.get(
          `payments/my-history/${user?.email}`
        );
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payment history:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaHistory></FaHistory> My Payment History
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
      ) : payments.length === 0 ? (
        <p className="text-center text-gray-500">No payment history found.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table className="w-full border rounded-lg">
            <TableHeader>
              <TableRow className="bg-gray-300">
                <TableHead className="text-black font-bold text-base text-center">
                  Booking ID
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Price (৳)
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Payment Date
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Delivery Status
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Transaction ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow
                  key={payment._id}
                  className="border-t text-center text-base"
                >
                  <TableCell className="p-3">{payment.bookingId}</TableCell>
                  <TableCell className="p-3">৳{payment.price}</TableCell>
                  <TableCell className="p-3">
                    {moment(payment.date).format("MMMM Do, YYYY, h:mm A")}
                  </TableCell>
                  <TableCell className="p-3">
                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        payment.deliveryStatus === "Delivered"
                          ? "bg-green-500"
                          : payment.deliveryStatus === "On The Way"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {payment.deliveryStatus}
                    </span>
                  </TableCell>
                  <TableCell className="p-3">{payment.transactionId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default MyPaymentHistory;
