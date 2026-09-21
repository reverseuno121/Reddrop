import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/MyRequest.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import {
  getMyBloodRequests,
  cancelBloodRequest,
} from "../../services/api";

function MyRequests() {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [confirmRequestId, setConfirmRequestId] = useState(null);

  const showError = (message) => {
    setPopupType("error");
    setPopupMessage(message);
  };

  const showSuccess = (message) => {
    setPopupType("success");
    setPopupMessage(message);
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMyBloodRequests(token);

        setRequests(data.requests);
      } catch (error) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleCancel = (requestId) => {
  setConfirmRequestId(requestId);
};

const confirmCancel = async () => {
  const requestId = confirmRequestId;

  setConfirmRequestId(null);

  try {
    setCancellingId(requestId);

    const data = await cancelBloodRequest(
      token,
      requestId
    );

    setRequests((currentRequests) =>
      currentRequests.map((request) =>
        request._id === requestId
          ? {
              ...request,
              status: data.request.status,
            }
          : request
      )
    );

    showSuccess(
      "Blood request cancelled successfully!"
    );
  } catch (error) {
    showError(error.message);
  } finally {
    setCancellingId(null);
  }
};

  const totalRequests = requests.length;

  const openRequests = requests.filter(
    (request) => request.status === "Open"
  ).length;

  const fulfilledRequests = requests.filter(
    (request) => request.status === "Fulfilled"
  ).length;

  if (loading) {
    return (
      <DashboardLayout role="recipient">

        <div className="my-requests-page">

          <div className="dashboard-welcome">
            <p className="section-tag">
              MY REQUESTS
            </p>

            <h1>
              Loading requests...
            </h1>

            <p>
              Please wait while we fetch your requests.
            </p>
          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recipient">

      <div className="my-requests-page">

        {/* Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            MY REQUESTS
          </p>

          <h1>
            My Blood Requests
          </h1>

          <p>
            Track and manage the blood requests you
            have created.
          </p>

        </div>


        {/* Statistics */}
        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>
              <p>Total Requests</p>
              <h2>{totalRequests}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔴
            </div>

            <div>
              <p>Open Requests</p>
              <h2>{openRequests}</h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ❤️
            </div>

            <div>
              <p>Fulfilled Requests</p>
              <h2>{fulfilledRequests}</h2>
            </div>

          </div>

        </div>


        {/* Requests */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Request History
              </h2>

              <p>
                All your blood requests are listed below.
              </p>

            </div>

            <Link
              to="/create-blood-request"
              className="dashboard-action my-requests-new-btn"
            >
              + New Request
            </Link>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table my-requests-table">

              <thead>

                <tr>
                  <th>Blood Group</th>
                  <th>Hospital</th>
                  <th>Location</th>
                  <th>Units</th>
                  <th>Required Date</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {requests.length === 0 ? (

                  <tr>

                    <td colSpan="8">
                      No blood requests found.
                    </td>

                  </tr>

                ) : (

                  requests.map((request) => (

                    <tr key={request._id}>

                      <td>
                        <strong className="blood-group">
                          {request.bloodGroup}
                        </strong>
                      </td>


                      <td>
                        {request.hospitalName}
                      </td>


                      <td>
                        {[request.city, request.district, request.state]
                          .filter(Boolean)
                          .join(", ")}
                      </td>

                      <td>
                        {request.unitsRequired}
                      </td>


                      <td>
                        {request.requiredDate
                          ? new Date(
                              request.requiredDate
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "—"}
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

                        <span
                            className={`recipient-request-status recipient-status-${request.status
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {request.status}
                          </span>

                      </td>


                      <td>

                        {request.status === "Open" && (
                          <button
                            type="button"
                            className="table-action"
                            onClick={() =>
                              handleCancel(request._id)
                            }
                            disabled={
                              cancellingId === request._id
                            }
                          >
                            {cancellingId === request._id
                              ? "Cancelling..."
                              : "Cancel"}
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
                              onClick={() =>
                                setSelectedRequest(request)
                              }
                            >
                              View Details
                            </button>
                          )}

                        {request.status === "Cancelled" && (
                          <span>————————</span>
                        )}

                      </td>
                                          
                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>
{selectedRequest && (
  <div className="request-details-modal">

    <div className="request-details-box">

      <div className="request-details-header">

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
          className="request-details-close"
          onClick={() =>
            setSelectedRequest(null)
          }
        >
          ×
        </button>

      </div>


      {/* Request Information */}
      <div className="request-details-section">

        <h3>
          Recipient Information
        </h3>

        <div className="request-details-grid">

          <div>
            <span>Patient Name</span>
            <strong>
              {selectedRequest.patientName || "—"}
            </strong>
          </div>

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
      <div className="request-details-section">

        <h3>
          Accepted Donor
        </h3>

        {selectedRequest.acceptedDonor ? (

          <div className="accepted-donor-details">

            <div className="accepted-donor-avatar">
              {selectedRequest.acceptedDonor.name
                ? selectedRequest.acceptedDonor.name
                    .charAt(0)
                    .toUpperCase()
                : "D"}
            </div>

            <div className="accepted-donor-info">

              <h3>
                {selectedRequest.acceptedDonor.name}
              </h3>

              <span className="available-text">
                ● Donor Accepted
              </span>

              <div className="accepted-donor-info-grid">

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


      <div className="request-details-actions">

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

        {/* Back */}
        <Link
          to="/recipient-dashboard"
          className="back-home"
        >
          ← Back to Dashboard
        </Link>

      </div>
      {popupMessage && (
  <MessagePopup
    type={popupType}
    title={
      popupType === "success"
        ? "Request Cancelled!"
        : undefined
    }
    icon={
      popupType === "success"
        ? "🚫"
        : undefined
    }
    message={popupMessage}
    onClose={() => setPopupMessage("")}
  />
)}

{confirmRequestId && (
  <MessagePopup
    title="Confirm Cancellation"
    message="Are you sure you want to cancel this blood request?"
    type="confirmation"
    showCancel={true}
    confirmText="OK"
    cancelText="Cancel"
    onConfirm={confirmCancel}
    onClose={() => setConfirmRequestId(null)}
  />
)}
    </DashboardLayout>
  );

}

export default MyRequests;