import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/BloodRequests.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import { getAdminBloodRequests , issueBlood, } from "../../services/api";

function BloodRequests() {
  const { token } = useAuth();

  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("All");
  const [urgency, setUrgency] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [issuing, setIssuing] = useState(false);

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [confirmIssueRequest, setConfirmIssueRequest] = useState(null);
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
        const data = await getAdminBloodRequests(token);

        setRequests(data.requests);
      } catch (error) {
        console.error(
          "Admin Blood Requests Error:",
          error.message
        );

        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRequests();
    }
  }, [token]);

  const handleIssueBlood = (request) => {
  setConfirmIssueRequest(request);
};

const confirmIssueBlood = async () => {
  const request = confirmIssueRequest;

  setConfirmIssueRequest(null);

  if (!request) {
    return;
  }

  try {
    setIssuing(true);

    const data = await issueBlood(token, request._id);

    setRequests((currentRequests) =>
      currentRequests.map((item) =>
        item._id === request._id
          ? data.request
          : item
      )
    );

    setSelectedRequest(data.request);

    showSuccess("Blood issued successfully!");
  } catch (error) {
    showError(error.message);
  } finally {
    setIssuing(false);
  }
};

  const filteredRequests = requests.filter((request) => {
    const searchValue = search.toLowerCase();

    const location = [
      request.city || "",
      request.district || "",
      request.state || "",
    ]
      .join(", ")
      .toLowerCase();

    const patientName =
      request.patientName?.toLowerCase() || "";

    const matchesSearch =
      patientName.includes(searchValue) ||
      location.includes(searchValue);

    const matchesBloodGroup =
      bloodGroup === "All" ||
      request.bloodGroup === bloodGroup;

    const matchesUrgency =
      urgency === "All" ||
      request.urgency === urgency;

    const matchesStatus =
      status === "All" ||
      request.status === status;

    return (
      matchesSearch &&
      matchesBloodGroup &&
      matchesUrgency &&
      matchesStatus
    );
  });

  const totalRequests = requests.length;

  const openRequests = requests.filter(
    (request) => request.status === "Open"
  ).length;

  const urgentRequests = requests.filter(
    (request) =>
      request.urgency === "Urgent" ||
      request.urgency === "Emergency"
  ).length;

  const fulfilledRequests = requests.filter(
    (request) => request.status === "Fulfilled"
  ).length;

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

  const getStatusClass = (requestStatus) => {
  if (requestStatus === "Open") {
    return "status-open";
  }

  if (requestStatus === "Donor Assigned") {
    return "status-donor-assigned";
  }

  if (requestStatus === "Donation Recorded") {
    return "status-donation-recorded";
  }

  if (requestStatus === "Fulfilled") {
    return "status-completed";
  }

  if (requestStatus === "Cancelled") {
    return "status-cancelled";
  }

  return "status-open";
};
  if (loading) {
    return (
      <DashboardLayout role="admin">

        <div className="admin-blood-requests-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              REQUEST MANAGEMENT
            </p>

            <h1>
              Loading requests...
            </h1>

            <p>
              Please wait while we fetch blood requests.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-blood-requests-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            REQUEST MANAGEMENT
          </p>

          <h1>
            Blood Requests
          </h1>

          <p>
            View and manage blood requests submitted
            by recipients.
          </p>

        </div>


        {/* Statistics */}
        <div className="admin-request-stats">

          <div className="admin-request-stat">

            <span>
              📋
            </span>

            <div>
              <p>
                Total Requests
              </p>

              <strong>
                {totalRequests}
              </strong>
            </div>

          </div>


          <div className="admin-request-stat">

            <span>
              🟡
            </span>

            <div>
              <p>
                Open Requests
              </p>

              <strong>
                {openRequests}
              </strong>
            </div>

          </div>


          <div className="admin-request-stat">

            <span>
              🔴
            </span>

            <div>
              <p>
                Urgent Requests
              </p>

              <strong>
                {urgentRequests}
              </strong>
            </div>

          </div>


          <div className="admin-request-stat">

            <span>
              ✓
            </span>

            <div>
              <p>
                Fulfilled
              </p>

              <strong>
                {fulfilledRequests}
              </strong>
            </div>

          </div>

        </div>


        {/* Requests */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                All Blood Requests
              </h2>

              <p>
                Search and filter blood requests.
              </p>

            </div>

          </div>


          {/* Filters */}
          <div className="admin-request-filters">

            <div className="admin-request-search">

              <label>
                Search
              </label>

              <input
                type="text"
                placeholder="Search patient or location..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <div>

              <label>
                Blood Group
              </label>

              <select
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(e.target.value)
                }
              >

                <option value="All">
                  All Groups
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

              </select>

            </div>


            <div>

              <label>
                Urgency
              </label>

              <select
                value={urgency}
                onChange={(e) =>
                  setUrgency(e.target.value)
                }
              >

                <option value="All">
                  All
                </option>

                <option value="Urgent">
                  Urgent
                </option>

                <option value="Emergency">
                  Emergency
                </option>

                <option value="Normal">
                  Normal
                </option>

              </select>

            </div>


            <div>

              <label>
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
              >

                <option value="All">
                    All
                  </option>

                  <option value="Open">
                    Open
                  </option>

                  <option value="Donor Assigned">
                    Donor Assigned
                  </option>

                  <option value="Donation Recorded">
                    Donation Recorded
                  </option>

                  <option value="Fulfilled">
                    Fulfilled
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

              </select>

            </div>

          </div>


          {/* Table */}
          <div className="dashboard-table-wrapper">

            <table className="dashboard-table admin-request-table">

              <thead>

                <tr>

                  <th>
                    Patient
                  </th>

                  <th>
                    Blood Group
                  </th>

                  <th>
                    Units
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Urgency
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredRequests.length > 0 ? (

                  filteredRequests.map((request) => (

                    <tr key={request._id}>

                      <td>
                        <strong>
                          {request.patientName}
                        </strong>
                      </td>


                      <td>

                        <span className="request-blood-group">
                          {request.bloodGroup}
                        </span>

                      </td>


                      <td>
                        {request.unitsRequired}
                      </td>


                      <td>
                        {[request.city, request.district, request.state]
                          .filter(Boolean)
                          .join(", ")}
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
                          className={getStatusClass(
                            request.status
                          )}
                        >
                          {request.status}
                        </span>

                      </td>


                      <td>
                        {formatDate(
                          request.requiredDate
                        )}
                      </td>


                      <td>

                        <div className="admin-request-actions">
                          <button
                            type="button"
                            className="admin-request-view-btn"
                            onClick={() => setSelectedRequest(request)}
                          >
                            View
                          </button>

                          {(request.status === "Open" ||
                            request.status === "Donation Recorded") && (
                            <button
                              type="button"
                              className="admin-request-issue-btn"
                              onClick={() => handleIssueBlood(request)}
                              disabled={issuing}
                            >
                              {issuing ? "Issuing..." : "Issue Blood"}
                            </button>
                          )}
                        </div>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="admin-no-requests"
                    >
                      No blood requests found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

                          </div>

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="admin-request-modal">

            <div className="admin-request-modal-box">

              <div className="admin-request-modal-header">

                <div>
                  <h2>Blood Request Details</h2>

                  <span
                    className={getStatusClass(
                      selectedRequest.status
                    )}
                  >
                    {selectedRequest.status}
                  </span>
                </div>

                <button
                  type="button"
                  className="admin-request-modal-close"
                  onClick={() =>
                    setSelectedRequest(null)
                  }
                >
                  ×
                </button>

              </div>


              {/* Request Information */}
              <div className="admin-request-modal-section">

                <h3>Recipient Information</h3>

                <div className="admin-request-details-grid">

                  <div>
                    <span>Patient</span>
                    <strong>
                      {selectedRequest.patientName || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Blood Group</span>
                    <strong className="request-blood-group">
                      {selectedRequest.bloodGroup || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Units</span>
                    <strong>
                      {selectedRequest.unitsRequired || "—"}
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
                      {formatDate(
                        selectedRequest.requiredDate
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Urgency</span>
                    <strong>
                      {selectedRequest.urgency || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Status</span>
                    <strong>
                      {selectedRequest.status || "—"}
                    </strong>
                  </div>

                </div>

              </div>


              {/* Accepted Donor */}
              <div className="admin-request-modal-section">

                <h3>Accepted Donor</h3>

                {selectedRequest.acceptedDonor ? (

                  <div className="admin-accepted-donor">

                    <div className="admin-donor-avatar">
                      {selectedRequest.acceptedDonor.name
                        ? selectedRequest.acceptedDonor.name
                            .charAt(0)
                            .toUpperCase()
                        : "D"}
                    </div>

                    <div className="admin-accepted-donor-info">

                      <h3>
                        {selectedRequest.acceptedDonor.name}
                      </h3>

                      <div className="admin-accepted-donor-grid">

                        <div>
                          <span>Name</span>
                          <strong>
                            {selectedRequest.acceptedDonor.name ||
                              "—"}
                          </strong>
                        </div>

                        <div>
                          <span>Blood Group</span>
                          <strong className="request-blood-group">
                            {selectedRequest.acceptedDonor.bloodGroup ||
                                "Not specified"}
                          </strong>
                        </div>

                        <div>
                          <span>Phone</span>

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
                    No donor has accepted this request yet.
                  </p>

                )}

              </div>


              <div className="admin-request-modal-actions">

                {selectedRequest.acceptedDonor?.phone && (
                  <a
                    href={`tel:${selectedRequest.acceptedDonor.phone}`}
                    className="admin-request-call-btn"
                  >
                    Call Donor
                  </a>
                )}

                <button
                  type="button"
                  className="admin-request-modal-close-btn"
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
      {popupMessage && (
  <MessagePopup
    type={popupType}
    title={
      popupType === "success"
        ? "Donation Confirmed"
        : undefined
    }
    icon={
      popupType === "success"
        ? "❤️"
        : undefined
    }
    message={popupMessage}
    onClose={() => setPopupMessage("")}
  />
)}

{confirmIssueRequest && (
  <MessagePopup
    title="Confirm Blood Issue"
    message={`Issue ${confirmIssueRequest.unitsRequired} unit${
      confirmIssueRequest.unitsRequired !== 1 ? "s" : ""
    } of ${confirmIssueRequest.bloodGroup} blood to ${
      confirmIssueRequest.patientName
    }?`}
    type="confirmation"
    showCancel={true}
    confirmText="OK"
    cancelText="Cancel"
    onConfirm={confirmIssueBlood}
    onClose={() => setConfirmIssueRequest(null)}
  />
)}
    </DashboardLayout>
  );
}

export default BloodRequests;