import Login from "@/pages/AuthPage/Login";
import MainLayout from "../layouts/MainLayout";
import { createBrowserRouter } from "react-router-dom";
import Register from "@/pages/AuthPage/Register";
import HomePage from "@/pages/HomePage/HomePage";
import DashBoardLayout from "@/layouts/DashBoardLayout";
import BookParcel from "@/pages/DashBoard/User/BookParcel";
import PrivateRoute from "./PrivateRoutes";
import MyParcel from "@/pages/DashBoard/User/MyParcel";
import UpdateBooking from "@/pages/DashBoard/User/UpdateBooking";
import MyProfile from "@/pages/DashBoard/User/MyProfile";
import AllUsers from "@/pages/DashBoard/Admin/AllUsers";
import AllParcels from "@/pages/DashBoard/Admin/AllParcels";
import AllDeliveryMen from "@/pages/DashBoard/Admin/AllDeliveryMen";
import Statistics from "@/pages/DashBoard/Admin/Statistics";
import MyDeliveryList from "@/pages/DashBoard/DeliveryMen/MyDeliveryList";
import MyReviews from "@/pages/DashBoard/DeliveryMen/MyReviews";
import Payment from "@/pages/DashBoard/User/Payment";
import PaymentSuccess from "@/pages/DashBoard/User/PaymentSuccess";
import AdminRoutes from "./AdminRoutes";
import DeliveryMenRoutes from "./DeliveryMenRoutes";
import DashboardRedirect from "@/pages/DashBoard/DashboardRedirect";
import MyPaymentHistory from "@/pages/DashBoard/User/MyPaymentHistory";
import ErrorPage from "@/pages/ErrorPage/ErrorPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashBoardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // users routes
      {
        index: true,
        element: <DashboardRedirect />,
      },
      {
        path: "/dashboard/my-profile",
        element: <MyProfile />,
      },
      {
        path: "/dashboard/book-parcel",
        element: <BookParcel />,
      },
      {
        path: "/dashboard/my-parcels",
        element: <MyParcel />,
      },
      {
        path: "/dashboard/payment/:id",
        element: <Payment />,
      },
      {
        path: "/dashboard/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/dashboard/my-payments",
        element: <MyPaymentHistory />,
      },
      {
        path: "/dashboard/update-parcel/:id",
        element: <UpdateBooking />,
        loader: ({ params }) => fetch(`/dashboard/update-parcel/${params.id}`),
      },

      // admin routes
      {
        path: "/dashboard/statistics",
        element: (
          <AdminRoutes>
            <Statistics />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/all-users",
        element: (
          <AdminRoutes>
            <AllUsers />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/all-parcels",
        element: (
          <AdminRoutes>
            <AllParcels />
          </AdminRoutes>
        ),
      },
      {
        path: "/dashboard/all-delivery-men",
        element: (
          <AdminRoutes>
            <AllDeliveryMen />
          </AdminRoutes>
        ),
      },

      // delivery man routes
      {
        path: "/dashboard/delivery-list",
        element: (
          <DeliveryMenRoutes>
            <MyDeliveryList />
          </DeliveryMenRoutes>
        ),
      },
      {
        path: "/dashboard/reviews",
        element: (
          <DeliveryMenRoutes>
            <MyReviews />
          </DeliveryMenRoutes>
        ),
      },
    ],
  },
]);
