import { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card } from "@/components/ui/card";
import { FaChartBar } from "react-icons/fa";
import Loading from "@/components/ui/Loading";

const Statistics = () => {
  const axiosSecure = useAxiosSecure();
  const [bookingsData, setBookingsData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    axiosSecure.get("admin/stats").then((res) => {
      // Group the bookings by date and sum the count for each date
      const groupedBookings = res.data.bookingsByDate.reduce((acc, item) => {
        const date = new Date(item._id).toLocaleDateString(); // Convert to readable date format
        if (acc[date]) {
          acc[date] += item.count;
        } else {
          acc[date] = item.count;
        }
        return acc;
      }, []);

      const groupedBookingsData = Object.keys(groupedBookings).map((date) => ({
        _id: date,
        count: groupedBookings[date],
      }));

      setBookingsData(groupedBookingsData);
      setComparisonData(res.data.comparisonData || []); // Set comparisonData as received
    });
  }, []);

  // Ensure that data exists before attempting to map over it
  if (!bookingsData.length || !comparisonData.length) {
    return <Loading />; // Show a loading message until data is available
  }

  // Bar Chart Data (Bookings by Date)
  const barChartOptions = {
    chart: { type: "bar" },
    xaxis: {
      categories: bookingsData.map((item) => item._id), // Dates for the X-axis
    },
    title: { text: "Bookings by Date", align: "center" },
    plotOptions: { bar: { horizontal: false } },
  };
  const barChartSeries = [
    {
      name: "Bookings",
      data: bookingsData.map((item) => item.count), // Count of bookings
    },
  ];

  // Line Chart Data (Booked vs Delivered)
  const lineChartOptions = {
    chart: {
      type: "line",
      toolbar: { show: true },
    },
    xaxis: {
      categories: comparisonData.map((item) =>
        new Date(item.date).toLocaleDateString("en-US")
      ), // Format date to MM/DD/YYYY
      title: { text: "Booking Date" },
    },
    yaxis: {
      title: { text: "Number of Parcels" },
      min: 0, // Start y-axis at 0
      max:
        Math.max(
          ...comparisonData.map((item) => Math.max(item.booked, item.delivered))
        ) + 1, // Set max dynamically
      tickAmount:
        Math.max(
          ...comparisonData.map((item) => Math.max(item.booked, item.delivered))
        ) + 1, // Ensure ticks increment by 1
    },
    stroke: {
      curve: "straight",
      width: 3,
    },
    markers: {
      size: 5,
      colors: ["#0000FF", "#008000"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    title: {
      text: "Booked vs Delivered Parcels",
      align: "center",
    },
    colors: ["#0000FF", "#008000"],
    legend: {
      position: "top",
      markers: {
        fillColors: ["#0000FF", "#008000"],
      },
    },
    grid: {
      borderColor: "#e7e7e7", // Light gray grid lines
      strokeDashArray: 4, // Dashed grid lines
    },
  };

  const lineChartSeries = [
    {
      name: "Booked",
      data: comparisonData.map((item) => item.booked), // Booked data
    },
    {
      name: "Delivered",
      data: comparisonData.map((item) => item.delivered), // Delivered data
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaChartBar /> Statistics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Bookings by Date */}
        <Card className="p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-4">📊 Bookings by Date</h3>
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height={500}
          />
        </Card>

        {/* Line Chart: Booked vs Delivered */}
        <Card className="p-4 shadow-lg">
          <h3 className="text-lg font-bold mb-4">📈 Booked vs Delivered</h3>
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={500}
          />
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
