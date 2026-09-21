import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/AdminDashboard.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";


import {
  getAdminDashboardStats,
  getAdminBloodRequests,
} from "../../services/api";

function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonors: 0,
    totalRecipients: 0,
    totalRequests: 0,
  });

  const [recentRequests, setRecentRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");

  const showError = (message) => {
    setPopupType("error");
    setPopupMessage(message);
  };

  const showSuccess = (message) => {
    setPopupType("success");
    setPopupMessage(message);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, requestsData] =
          await Promise.all([
            getAdminDashboardStats(token),
            getAdminBloodRequests(token),
          ]);

        setStats(statsData.stats);

        setRecentRequests(
          (requestsData.requests || []).slice(0, 5)
        );
      } catch (error) {
        console.error(
          "Admin Dashboard Error:",
          error.message
        );

        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  if (loading) {
    return (
      <DashboardLayout role="admin">

        <div className="admin-dashboard-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              ADMIN PANEL
            </p>

            <h1>
              Loading dashboard...
            </h1>

            <p>
              Please wait while we fetch the latest
              RedDrop statistics.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-dashboard-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            ADMIN PANEL
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage users, blood requests, donations,
            and RedDrop activities.
          </p>

        </div>


        {/* Statistics */}
        <div className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👥
            </div>

            <div>
              <p>
                Total Users
              </p>

              <h2>
                {stats.totalUsers}
              </h2>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🩸
            </div>

            <div>
              <p>
                Total Donors
              </p>

              <h2>
                {stats.totalDonors}
              </h2>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ❤️
            </div>

            <div>
              <p>
                Total Recipients
              </p>

              <h2>
                {stats.totalRecipients}
              </h2>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📋
            </div>

            <div>
              <p>
                Blood Requests
              </p>

              <h2>
                {stats.totalRequests}
              </h2>
            </div>

          </div>

        </div>


        {/* Quick Actions */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                Quick Actions
              </h2>

              <p>
                Manage important RedDrop activities.
              </p>
            </div>

          </div>


          <div className="admin-actions">

            <Link
              to="/admin-users"
              className="admin-action-card"
            >

              <div className="admin-action-icon">
                👥
              </div>

              <div>
                <h3>
                  Manage Users
                </h3>

                <p>
                  View and manage donors and recipients.
                </p>
              </div>

              <span>
                →
              </span>

            </Link>


            <Link
              to="/admin-blood-requests"
              className="admin-action-card"
              >

              <div className="admin-action-icon">
                🩸
              </div>

              <div>
                <h3>
                  Blood Requests
                </h3>

                <p>
                  View and manage blood requests.
                </p>
              </div>

              <span>
                →
              </span>

            </Link>


            <Link
              to="/admin-donations"
              className="admin-action-card"
            >

              <div className="admin-action-icon">
                ❤️
              </div>

              <div>
                <h3>
                  Donations
                </h3>

                <p>
                  View blood donation records.
                </p>
              </div>

              <span>
                →
              </span>

            </Link>


            <Link
              to="/admin-profile"
              className="admin-action-card"
            >

              <div className="admin-action-icon">
                👤
              </div>

              <div>
                <h3>
                  Admin Profile
                </h3>

                <p>
                  View and manage your profile.
                </p>
              </div>

              <span>
                →
              </span>

            </Link>

          </div>

        </div>


        {/* Recent Requests */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Recent Blood Requests
              </h2>

              <p>
                Latest blood requests submitted on
                RedDrop.
              </p>

            </div>


            <Link
              to="/admin-blood-requests"
              className="dashboard-action"
            >
              View All
            </Link>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table admin-request-table">

              <thead>

                <tr>
                  <th>
                    Blood Group
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Units
                  </th>

                  <th>
                    Urgency
                  </th>

                  <th>
                    Status
                  </th>
                </tr>

              </thead>


              <tbody>

                {recentRequests.length === 0 ? (

                  <tr>

                    <td colSpan="5">
                      No blood requests available.
                    </td>

                  </tr>

                ) : (

                  recentRequests.map((request) => (

                    <tr key={request._id}>

                      <td>
                        <strong className="blood-group">
                          {request.bloodGroup}
                        </strong>
                      </td>


                      <td>
                        {request.city},{" "}
                        {request.district},{" "}
                        {request.state}
                      </td>


                      <td>
                        {request.unitsRequired}
                      </td>


                      <td>

                        <span
                          className={
                            request.urgency === "Urgent" ||
                            request.urgency === "Emergency"
                              ? "status-urgent"
                              : "status-normal"
                          }
                        >
                          {request.urgency}
                        </span>

                      </td>


                      <td>

                        {request.status === "Open" && (
                          <span className="status-open">
                            Open
                          </span>
                        )}

                        {request.status === "Donor Assigned" && (
                          <span className="status-donor-assigned">
                            Donor Assigned
                          </span>
                        )}

                        {request.status === "Donation Recorded" && (
                          <span className="status-donation-recorded">
                            Donation Recorded
                          </span>
                        )}

                        {request.status === "Fulfilled" && (
                          <span className="status-completed">
                            Fulfilled
                          </span>
                        )}

                        {request.status === "Cancelled" && (
                          <span className="status-cancelled">
                            Cancelled
                          </span>
                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    {popupMessage && (
    <MessagePopup
      message={popupMessage}
      type={popupType}
      onClose={() => setPopupMessage("")}
    />
  )}

    </DashboardLayout>
  );
}

export default AdminDashboard;