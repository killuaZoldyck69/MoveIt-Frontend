import { FaStar, FaTruck } from "react-icons/fa";
import useDeliveryMen from "@/hooks/useDeliveryMen";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";

const AllDeliveryMen = () => {
  const { deliveryMen, deliveryMenLoading } = useDeliveryMen();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaTruck /> All Delivery Men ({deliveryMen.length})
      </h2>

      <Card className="shadow-lg rounded-lg p-4 bg-white">
        {deliveryMenLoading ? (
          <div className="flex justify-center items-center">
            <div
              className="spinner-border animate-spin inline-block"
              role="status"
            >
              <Loader />
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-300">
                <TableHead className="text-black font-bold text-base text-center">
                  Name
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Phone
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Parcels Delivered
                </TableHead>
                <TableHead className="text-black font-bold text-base text-center">
                  Avg. Review
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryMen.map((man) => (
                <TableRow
                  key={man._id}
                  className="border-t text-center text-base"
                >
                  <TableCell className="flex items-center justify-center gap-3">
                    <img
                      src={man.photoURL}
                      alt="Profile"
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    {man.name}
                  </TableCell>{" "}
                  <TableCell className="p-2">{man.phoneNumber}</TableCell>
                  <TableCell className="p-2">
                    {man.deliveryCount || 0}
                  </TableCell>
                  <TableCell className="p-2 flex justify-center items-center  gap-1 text-yellow-500">
                    <FaStar /> {man.avgRating || "N/A"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AllDeliveryMen;
