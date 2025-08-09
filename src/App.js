import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import ForgotPassword from "./auth/forgotpassword";
import ResetPassword from "./auth/resetpassword";

import OnlineBroadbandOrdering from "./Online Broadband Ordering/OnlineBroadbandOrdering";
import CustomerPortal from "./Customer Portal/CustomerPortal";
import Addresspage from "./Address Page/Addresspage";
import ProductSelectLayout from "./Product Select Layout/ProductSelectLayout";
import CheckoutPage from "./Checkout Page/CheckoutPage";
import AnalyticsDashboard from "./AnalyticsDashboard/AnalyticsDashboard";
import OrderInsights from "./OrderInsights/OrderInsights";
import OrderOverview from "./OrderOverview/OrderOverview";
import Status from "./StatusChecker/StatusChecker";
import OrderDashboard from "./OrderDashboard/Orderdashboard";
import UserAdmin from "./UserAdmin/useradmin";
import Cancel from "./CancelOrder/cancel";
import Cease from "./CeaseOrder/cease";
import Regrade from "./Regrade/regrade";
import Suspend from "./Suspend/suspend";

import AppointGet from "./GetAppointment/getAppointment";
import AppointReserve from "./ReserveAppointment/reserveAppointment";
import OrderCreation from "./CreateOrder/OrderCreation";
import MiddleCommand from "./MiddleCommand/middlecommand";
import AddUser from "./AddUser/adduser";
import { roles } from "./utils/constant";
import ProtectedRoute from "../src/utils/Protectedroutes";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/customer-portal"
          element={
            <ProtectedRoute
              allowedRoles={[
                roles.Admin,
                roles.Provisioner,
                roles.Scheduler,
                roles.Supervisor,
              ]}
            >
              <CustomerPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-user"
          element={
            <ProtectedRoute allowedRoles={[roles.Admin]}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/online-broadband-ordering"
          element={
            <ProtectedRoute
              allowedRoles={[roles.Admin, roles.Provisioner, roles.Scheduler]}
            >
              <OnlineBroadbandOrdering />
            </ProtectedRoute>
          }
        />
        <Route path="/select-address" element={<Addresspage />} />
        <Route
          path="/product-select-layout"
          element={<ProductSelectLayout />}
        />
        <Route path="/checkout-summary" element={<CheckoutPage />} />
        <Route path="/provisioning-command" element={<MiddleCommand />} />

        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/order-insights" element={<OrderInsights />} />
        <Route path="/order-overview" element={<OrderOverview />} />
        <Route
          path="/status-checker"
          element={
            <ProtectedRoute
              allowedRoles={[roles.Admin, roles.Provisioner, roles.Scheduler]}
            >
              <Status />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-dashboard"
          element={
            <ProtectedRoute
              allowedRoles={[roles.Admin, roles.Provisioner, roles.Scheduler]}
            >
              <OrderDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/user-admin" element={<UserAdmin />} />
        <Route
          path="/cancel-order"
          element={
            <ProtectedRoute
              allowedRoles={[roles.Admin, roles.Provisioner, roles.Scheduler]}
            >
              <Cancel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cease-order"
          element={
            <ProtectedRoute allowedRoles={[roles.Admin, roles.Supervisor]}>
              <Cease />
            </ProtectedRoute>
          }
        />
        <Route
          path="/regrade"
          element={
            <ProtectedRoute
              allowedRoles={[roles.Admin, roles.Provisioner, roles.Scheduler]}
            >
              <Regrade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suspend-order"
          element={
            <ProtectedRoute allowedRoles={[roles.Admin, roles.Supervisor]}>
              <Suspend />
            </ProtectedRoute>
          }
        />
        <Route path="/get-appointment" element={<AppointGet />} />
        <Route path="/reserve-appointment" element={<AppointReserve />} />
        <Route path="/createorder" element={<OrderCreation />} />
      </Routes>
    </Router>
  );
};

export default App;
