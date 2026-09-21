import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/DonorDashboard.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";

import {
  getDonorProfile,
  getBloodRequests,
  acceptBloodRequest,
  getDonorAvailability,
  updateDonorAvailability,
  getMyDonations,
} from "../../services/api";

function DonorDashboard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [donor, setDonor] = useState(null);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [availability, setAvailability] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [confirmRequestId, setConfirmRequestId] = useState(null);

  const confirmAccept = async () => {
  const requestId = confirmRequestId;

  setConfirmRequestId(null);

  if (!requestId) {
    return;
  }

  await handleAcceptRequest(requestId);
};

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
        const [
          profileData,
          requestsData,
          availabilityData,
          donationsData,
        ] = await Promise.all([
          getDonorProfile(token),
          getBloodRequests(token),
          getDonorAvailability(token),
          getMyDonations(token),
        ]);

        setDonor(profileData.donor);
        setRequests(requestsData.requests);
        setAvailability(availabilityData.availability);
        setDonations(donationsData.donations);
      } catch (error) {
        console.error(
          "Donor Dashboard Error:",
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

  const handleAcceptRequest = async (requestId) => {
  try {
    setAcceptingId(requestId);

    const data = await acceptBloodRequest(
      token,
      requestId
    );

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request._id === requestId
          ? data.request
          : request
      )
    );

    showSuccess("Blood request accepted successfully!");
  } catch (error) {
    showError(error.message);
  } finally {
    setAcceptingId(null);
  }
};

  const handleAvailabilityChange = async () => {
  if (updatingAvailability) {
    return;
  }

  try {
    setUpdatingAvailability(true);

    const newAvailability = !availability;

    await updateDonorAvailability(
      token,
      newAvailability
    );

    setAvailability(newAvailability);
  } catch (error) {
    showError(error.message);
  } finally {
    setUpdatingAvailability(false);
  }
};

  const nearbyRequests = donor?.district
    ? requests.filter(
        (request) =>
          request.district?.toLowerCase() ===
          donor.district.toLowerCase()
      )
    : requests;

  const totalDonations = donations.filter(
    (donation) => donation.status === "Completed"
  ).length;

  const completedDonations = donations
  .filter((donation) => donation.status === "Completed")
  .sort(
    (a, b) =>
      new Date(b.donationDate) -
      new Date(a.donationDate)
  );

  const lastDonation = completedDonations[0] || null;

  const recentDonations = completedDonations.slice(0, 5);

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <DashboardLayout role="donor">
        <div className="donor-dashboard-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              DONOR DASHBOARD
            </p>

            <h1>
              Loading dashboard...
            </h1>

            <p>
              Please wait while we fetch your RedDrop data.
            </p>

          </div>

        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="donor">

      <div className="donor-dashboard-page">

        {/* Welcome */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            DONOR DASHBOARD
          </p>

          <h1>
            Welcome back! 🩸
          </h1>

          <p>
            Thank you for being a part of the RedDrop
            life-saving community.
          </p>

        </div>


        {/* Statistics */}
        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              🩸
            </div>

            <div>
              <p>
                Blood Group
              </p>

              <h2>
                {donor?.bloodGroup || "Not Set"}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ❤️
            </div>

            <div>
              <p>
                Total Donations
              </p>

              <h2>
                {totalDonations}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>
              <p>
                Last Donation
              </p>

              <h2>
                {lastDonation
                  ? formatDate(
                      lastDonation.donationDate
                    )
                  : "—"}
              </h2>
            </div>

          </div>

        </div>


        {/* Availability */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                Donation Availability
              </h2>

              <p>
                Let recipients know whether you are
                currently available to donate.
              </p>
            </div>

            <button
              type="button"
              className={`availability-badge ${
                availability ? "available" : "not-available"
              }`}
              onClick={handleAvailabilityChange}
              disabled={updatingAvailability}
            >
              {updatingAvailability
                ? "Updating..."
                : availability
                ? "● Available"
                : "● Not Available"}
            </button>

          </div>

        </div>


        {/* Recent Donation */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                Recent Donation
              </h2>

              <p>
                Your latest blood donation records.
              </p>
            </div>

            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/donation-history")
              }
            >
              View History
            </button>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                </tr>
              </thead>


              <tbody>

                {recentDonations.length === 0 ? (

                  <tr>
                    <td colSpan="4">
                      No donation records available.
                    </td>
                  </tr>

                ) : (

                  recentDonations.map((donation) => (

                    <tr key={donation._id}>

                      <td>
                        {formatDate(
                          donation.donationDate
                        )}
                      </td>

                      <td>
                        {donation.hospitalName}
                      </td>

                      <td>
                        {donation.bloodGroup}
                      </td>

                      <td>

                        {donation.status ===
                          "Completed" && (
                          <span className="status-completed">
                            Completed
                          </span>
                        )}

                        {donation.status ===
                          "Cancelled" && (
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


        {/* Blood Requests */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                Nearby Blood Requests
              </h2>

              <p>
                People who currently need blood.
              </p>
            </div>

            <button
              className="dashboard-action"
              onClick={() =>
                navigate("/blood-requests")
              }
            >
              View All
            </button>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>
                <tr>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Urgency</th>
                  <th>Action</th>
                </tr>
              </thead>


              <tbody>

                {nearbyRequests.length === 0 ? (

                  <tr>
                    <td colSpan="4">
                      No nearby blood requests available.
                    </td>
                  </tr>

                ) : (

                  nearbyRequests
                    .slice(0, 5)
                    .map((request) => (

                      <tr key={request._id}>

                        <td>
                          {request.bloodGroup}
                        </td>

                        <td>
                          {[request.city, request.district, request.state]
                            .filter(Boolean)
                            .join(", ")}
                        </td>

                        <td>

                          <span
                            className={
                              request.urgency ===
                                "Urgent" ||
                              request.urgency ===
                                "Emergency"
                                ? "status-urgent"
                                : "status-normal"
                            }
                          >
                            {request.urgency}
                          </span>

                        </td>

                        <td>
                          {request.status === "Open" && (
                            <button
                              type="button"
                              className="table-action"
                              onClick={() => setConfirmRequestId(request._id)}
                              disabled={acceptingId === request._id}
                            >
                              {acceptingId === request._id
                                ? "Accepting..."
                                : "Respond"}
                            </button>
                          )}

                          {(
                            request.status === "Donor Assigned" ||
                            request.status === "Donation Recorded" ||
                            request.status === "Fulfilled"
                          ) && (
                            <button
                              type="button"
                              className="table-action"
                              onClick={() => setSelectedRequest(request)}
                            >
                              View Details
                            </button>
                          )}
                        </td>
                      </tr>

                    ))

                )}

              </tbody>

            </table>

          </div>

        </div>

                {/* Accepted Request Details Modal */}
{selectedRequest && (
  <div className="donor-request-modal">

    <div className="donor-request-modal-box">

      <div className="donor-request-modal-header">

        <div>
          <h2>
            Blood Request Details
          </h2>

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
          className="donor-request-close"
          onClick={() =>
            setSelectedRequest(null)
          }
        >
          ×
        </button>

      </div>


      <div className="donor-request-details-section">

        <h3>
          Request Information
        </h3>

        <div className="donor-request-details-grid">

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


      <div className="donor-request-details-section">

        <h3>
          Recipient Information
        </h3>

        {selectedRequest.recipient ? (

          <div className="donor-recipient-details">

            <div className="donor-recipient-avatar">
              {selectedRequest.recipient.name
                ? selectedRequest.recipient.name
                    .charAt(0)
                    .toUpperCase()
                : "R"}
            </div>

            <div className="donor-recipient-info">

              <h3>
                {selectedRequest.recipient.name}
              </h3>

              <div className="donor-recipient-grid">

                <div>
                  <span>
                    Phone Number
                  </span>

                  {selectedRequest.recipient.phone ? (
                    <a
                      href={`tel:${selectedRequest.recipient.phone}`}
                    >
                      {selectedRequest.recipient.phone}
                    </a>
                  ) : (
                    <strong>
                      Not available
                    </strong>
                  )}
                </div>

                <div>
                  <span>
                    Email
                  </span>

                  <strong>
                    {selectedRequest.recipient.email ||
                      "Not available"}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        ) : (

          <p>
            Recipient information is not available.
          </p>

        )}

      </div>


      <div className="donor-request-modal-actions">

        {selectedRequest.recipient?.phone && (
          <a
            href={`tel:${selectedRequest.recipient.phone}`}
            className="table-action"
          >
            Call Recipient
          </a>
        )}

        <button
          type="button"
          className="dashboard-action"
          onClick={() =>
            setSelectedRequest(null)
          }
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}
</div>

{popupMessage && (
  <MessagePopup
    message={popupMessage}
    type={popupType}
    onClose={() => setPopupMessage("")}
  />
)}

{confirmRequestId && (
  <MessagePopup
    title="Confirm Response"
    message="Are you sure you want to respond to this blood request?"
    type="confirmation"
    showCancel={true}
    confirmText="OK"
    cancelText="Cancel"
    onConfirm={confirmAccept}
    onClose={() => setConfirmRequestId(null)}
  />
)}
    </DashboardLayout>
  );
}

export default DonorDashboard;