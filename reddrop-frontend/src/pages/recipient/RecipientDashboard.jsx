import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/RecipientDashboard.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import {
  getRecipientProfile,
  getMyBloodRequests,
} from "../../services/api";

function RecipientDashboard() {
  const { token } = useAuth();

  const [recipient, setRecipient] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");

  const showError = (message) => {
    setPopupType("error");
    setPopupMessage(message);
  };
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileData, requestsData] = await Promise.all([
          getRecipientProfile(token),
          getMyBloodRequests(token),
        ]);

        setRecipient(profileData.recipient);
        setRequests(requestsData.requests);
      } catch (error) {
        console.error(error.message);
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const activeRequests = requests.filter(
  (request) =>
    request.status === "Open" ||
    request.status === "Donor Assigned" ||
    request.status === "Donation Recorded"
).length;
  const fulfilledRequests = requests.filter(
  (request) => request.status === "Fulfilled"
).length;

  const recentRequests = requests.slice(0, 5);

  if (loading) {
    return (
      <DashboardLayout role="recipient">
        <div className="dashboard-welcome">

          <p className="section-tag">
            RECIPIENT DASHBOARD
          </p>

          <h1>
            Loading dashboard...
          </h1>

          <p>
            Please wait while we fetch your RedDrop data.
          </p>

        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recipient">

      {/* Welcome */}
      <div className="dashboard-welcome">

        <p className="section-tag">
          RECIPIENT DASHBOARD
        </p>

        <h1>
          Welcome back! 🏥
        </h1>

        <p>
          Find blood donors and manage your blood
          requests from here.
        </p>

      </div>


      {/* Statistics */}
      <div className="dashboard-stats">

        <div className="stat-card">

          <div className="stat-icon">
            🩸
          </div>

          <div>
            <p>Blood Group</p>

            <h2>
              {recipient?.bloodGroup || "Not Set"}
            </h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            📋
          </div>

          <div>
            <p>Active Requests</p>

            <h2>
              {activeRequests}
            </h2>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            ❤️
          </div>

          <div>
            <p>Requests Fulfilled</p>

            <h2>
              {fulfilledRequests}
            </h2>
          </div>

        </div>

      </div>


      {/* Quick Actions */}
      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>
              What do you need?
            </h2>

            <p>
              Quickly access the most important
              blood services.
            </p>
          </div>

        </div>


        <div className="recipient-actions">

          <Link
            to="/find-donor"
            className="recipient-action-card"
          >
            <div className="action-icon">
              🔎
            </div>

            <div>
              <h3>
                Find a Donor
              </h3>

              <p>
                Search for available blood donors
                near you.
              </p>
            </div>

            <span>
              →
            </span>

          </Link>


          <Link
            to="/create-blood-request"
            className="recipient-action-card"
          >
            <div className="action-icon">
              🩸
            </div>

            <div>
              <h3>
                Request Blood
              </h3>

              <p>
                Create a blood request for yourself
                or someone in need.
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
              My Recent Requests
            </h2>

            <p>
              Track your latest blood requests.
            </p>
          </div>

          <Link
            to="/my-requests"
            className="dashboard-action"
          >
            View All
          </Link>

        </div>


        <div className="dashboard-table-wrapper">

          <table className="dashboard-table">

            <thead>
              <tr>
                <th>Blood Group</th>
                <th>Location</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {recentRequests.length === 0 ? (

                <tr>
                  <td colSpan="6">
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
                      {[request.city, request.district, request.state]
                        .filter(Boolean)
                        .join(", ")}
                    </td>

                    <td>
                      {request.unitsRequired}{" "}
                      {request.unitsRequired === 1
                        ? "Unit"
                        : "Units"}
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

                    <td>
                      {(
                        request.status === "Open" ||
                        request.status === "Donor Assigned" ||
                        request.status === "Donation Recorded" ||
                        request.status === "Fulfilled"
                      ) ? (
                        <button
                          type="button"
                          className="table-action"
                          onClick={() => setSelectedRequest(request)}
                        >
                          View Details
                        </button>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

              {/* Request Details Model */}
        {selectedRequest && (
          <div className="recipient-request-modal">

            <div className="recipient-request-modal-box">

              <div className="recipient-request-modal-header">

                <div>
                  <h2>Blood Request Details</h2>

                  <span
                    className={`recipient-request-status recipient-status-${selectedRequest.status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="recipient-request-close"
                  onClick={() => setSelectedRequest(null)}
                >
                  ×
                </button>

              </div>


              {/* Request Information */}
              <div className="recipient-request-details-section">

                <h3>Request Information</h3>

                <div className="recipient-request-details-grid">

                  <div>
                    <span>Blood Group</span>

                    <strong className="blood-group">
                      {selectedRequest.bloodGroup}
                    </strong>
                  </div>

                  <div>
                    <span>Units Required</span>

                    <strong>
                      {selectedRequest.unitsRequired}
                    </strong>
                  </div>

                  <div>
                    <span>Hospital</span>

                    <strong>
                      {selectedRequest.hospitalName || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Location</span>

                    <strong>
                      {[
                        selectedRequest.city,
                        selectedRequest.district,
                        selectedRequest.state,
                      ]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Required Date</span>

                    <strong>
                      {selectedRequest.requiredDate
                        ? new Date(
                            selectedRequest.requiredDate
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Urgency</span>

                    <strong>
                      {selectedRequest.urgency}
                    </strong>
                  </div>

                </div>

              </div>


              {/* Donor Information */}
              <div className="recipient-request-details-section">

                <h3>Accepted Donor</h3>

                {selectedRequest.acceptedDonor ? (

                  <div className="recipient-accepted-donor">

                    <div className="recipient-donor-avatar">
                      {selectedRequest.acceptedDonor.name
                        ? selectedRequest.acceptedDonor.name
                            .charAt(0)
                            .toUpperCase()
                        : "D"}
                    </div>

                    <div className="recipient-donor-info">

                      <h3>
                        {selectedRequest.acceptedDonor.name}
                      </h3>

                      <span className="available-text">
                        ● Donor Accepted
                      </span>

                      <div className="recipient-donor-grid">

                        <div>
                          <span>Blood Group</span>

                          <strong className="blood-group">
                            {selectedRequest.acceptedDonor.bloodGroup ||
                              "Not specified"}
                          </strong>
                        </div>

                        <div>
                          <span>Phone Number</span>

                          {selectedRequest.acceptedDonor.phone ? (
                            <a
                              href={`tel:${selectedRequest.acceptedDonor.phone}`}
                            >
                              {selectedRequest.acceptedDonor.phone}
                            </a>
                          ) : (
                            <strong>
                              Not available
                            </strong>
                          )}
                        </div>

                        <div>
                          <span>Email</span>

                          <strong>
                            {selectedRequest.acceptedDonor.email ||
                              "Not available"}
                          </strong>
                        </div>

                      </div>

                    </div>

                  </div>

                ) : (

                  <p>
                    Donor information is not available.
                  </p>

                )}

              </div>


              <div className="recipient-request-modal-actions">

                {selectedRequest.acceptedDonor?.phone && (
                  <a
                    href={`tel:${selectedRequest.acceptedDonor.phone}`}
                    className="table-action"
                  >
                    Call Donor
                  </a>
                )}

                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() => setSelectedRequest(null)}
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )}
        
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

export default RecipientDashboard;