import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

/* Main */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./components/NotFound";

/* Donor */
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";
import DonationHistory from "./pages/donor/DonationHistory";
import BloodRequests from "./pages/donor/BloodRequests";

/* Recipient */
import MyRequests from "./pages/recipient/MyRequests";
import RecipientProfile from "./pages/recipient/RecipientProfile";
import CreateBloodRequest from "./pages/recipient/CreateBloodRequest";
import RecipientDashboard from "./pages/recipient/RecipientDashboard";
import FindDonor from "./pages/recipient/FindDonor";

/* Admin */
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import AdminBloodRequests from "./pages/admin/BloodRequests";
import BloodInventory from "./pages/admin/BloodInventory";
import Donors from "./pages/admin/Donors";
import Donations from "./pages/admin/Donations";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Donor */}
        <Route
          path="/donor-dashboard"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donor-profile"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/donation-history"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <DonationHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blood-requests"
          element={
            <ProtectedRoute allowedRoles={["donor"]}>
              <BloodRequests />
            </ProtectedRoute>
          }
        />

        {/* Recipient */}
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute allowedRoles={["recipient"]}>
              <MyRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipient-profile"
          element={
            <ProtectedRoute allowedRoles={["recipient"]}>
              <RecipientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-blood-request"
          element={
            <ProtectedRoute allowedRoles={["recipient"]}>
              <CreateBloodRequest />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipient-dashboard"
          element={
            <ProtectedRoute allowedRoles={["recipient"]}>
              <RecipientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/find-donor"
          element={
            <ProtectedRoute allowedRoles={["recipient"]}>
              <FindDonor />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin-profile"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-blood-requests"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminBloodRequests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-blood-inventory"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <BloodInventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-donors"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Donors />
            </ProtectedRoute>
          }
        />


          <Route
          path="/admin-donations"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Donations />
            </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
  </Routes>

    </BrowserRouter>
  );
}

export default App;