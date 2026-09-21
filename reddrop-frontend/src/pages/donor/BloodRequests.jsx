import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import LocationSelector from "../../components/LocationSelector";
import "./styles/BloodRequests.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";

import {
  getBloodRequests,
  acceptBloodRequest,
} from "../../services/api";

function BloodRequests() {
  const { token } = useAuth();

  const [location, setLocation] = useState({
    state: "",
    district: "",
    city: "",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [bloodGroup, setBloodGroup] = useState("");
  const [urgency, setUrgency] = useState("");

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [confirmRequestId, setConfirmRequestId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);

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
    const fetchRequests = async () => {
      try {
        const data = await getBloodRequests(token);

        const requestList = data.requests || [];

        setRequests(requestList);
        setFilteredRequests(requestList);
      } catch (error) {
        console.error(
          "Blood Requests Error:",
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

  const handleSearch = () => {
    const result = requests.filter((request) => {
      const matchesBloodGroup =
        !bloodGroup ||
        request.bloodGroup === bloodGroup;

      const matchesUrgency =
        !urgency ||
        request.urgency?.toLowerCase() ===
          urgency.toLowerCase();

      const matchesState =
        !location.state ||
        request.state?.toLowerCase() ===
          location.state.toLowerCase();

      const matchesDistrict =
        !location.district ||
        request.district?.toLowerCase() ===
          location.district.toLowerCase();

      const matchesCity =
        !location.city ||
        request.city?.toLowerCase() ===
          location.city.toLowerCase();

      return (
        matchesBloodGroup &&
        matchesUrgency &&
        matchesState &&
        matchesDistrict &&
        matchesCity
      );
    });

    setFilteredRequests(result);
  };

const handleAccept = (requestId) => {
  setConfirmRequestId(requestId);
};

const confirmAccept = async () => {
  const requestId = confirmRequestId;

  setConfirmRequestId(null);

  try {
    setAcceptingId(requestId);

    const data = await acceptBloodRequest(
      token,
      requestId
    );

    showSuccess("Blood request accepted successfully!");

    const updatedRequests = requests.map((request) =>
      request._id === requestId
        ? data.request
        : request
    );

    setRequests(updatedRequests);

    // Re-apply current filters
    const result = updatedRequests.filter((request) => {
      const matchesBloodGroup =
        !bloodGroup ||
        request.bloodGroup === bloodGroup;

      const matchesUrgency =
        !urgency ||
        request.urgency?.toLowerCase() ===
          urgency.toLowerCase();

      const matchesState =
        !location.state ||
        request.state?.toLowerCase() ===
          location.state.toLowerCase();

      const matchesDistrict =
        !location.district ||
        request.district?.toLowerCase() ===
          location.district.toLowerCase();

      const matchesCity =
        !location.city ||
        request.city?.toLowerCase() ===
          location.city.toLowerCase();

      return (
        matchesBloodGroup &&
        matchesUrgency &&
        matchesState &&
        matchesDistrict &&
        matchesCity
      );
    });

    setFilteredRequests(result);
  } catch (error) {
    showError(error.message);
  } finally {
    setAcceptingId(null);
  }
};
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

  const getLocation = (request) => {
    return [
      request.city,
      request.district,
      request.state,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return (
      <DashboardLayout role="donor">

        <div className="blood-requests-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              BLOOD REQUESTS
            </p>

            <h1>
              Loading requests...
            </h1>

            <p>
              Please wait while we fetch available
              blood requests.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="donor">

      <div className="blood-requests-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            BLOOD REQUESTS
          </p>

          <h1>
            People Who Need Blood
          </h1>

          <p>
            View blood requests and help someone in need.
          </p>

        </div>


        {/* Filter Section */}
        <div className="dashboard-section">

          <div className="request-filters">

            {/* Blood Group */}
            <div className="filter-group">

              <label>
                Required Blood Group
              </label>

              <select
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(e.target.value)
                }
              >
                <option value="">
                  All Required Blood Groups
                </option>

                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>

            </div>


            {/* Location */}
            <LocationSelector
              onLocationChange={setLocation}
            />


            {/* Urgency */}
            <div className="filter-group">

              <label>
                Urgency
              </label>

              <select
                value={urgency}
                onChange={(e) =>
                  setUrgency(e.target.value)
                }
              >
                <option value="">
                  All
                </option>

                <option value="urgent">
                  Urgent
                </option>

                <option value="normal">
                  Normal
                </option>

                <option value="emergency">
                  Emergency
                </option>
              </select>

            </div>


            <button
              type="button"
              className="filter-btn"
              onClick={handleSearch}
            >
              Search
            </button>

          </div>

        </div>


        {/* Requests */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Available Blood Requests
              </h2>

              <p>
                Requests that may match your blood group.
              </p>

            </div>

            <span className="request-count">
              {filteredRequests.length}{" "}
              {filteredRequests.length === 1
                ? "Request"
                : "Requests"}
            </span>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>

                <tr>
                  <th>Blood Group</th>
                  <th>Location</th>
                  <th>Units</th>
                  <th>Required Date</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {filteredRequests.length === 0 ? (

                  <tr>

                    <td colSpan="7">
                      No matching blood requests found.
                    </td>

                  </tr>

                ) : (

                  filteredRequests.map((request) => (

                    <tr key={request._id}>

                      <td>
                        <strong className="blood-group">
                          {request.bloodGroup}
                        </strong>
                      </td>


                      <td>
                        {getLocation(request) || "—"}
                      </td>


                      <td>
                        {request.unitsRequired} Unit
                        {request.unitsRequired !== 1
                          ? "s"
                          : ""}
                      </td>


                      <td>
                        {formatDate(
                          request.requiredDate
                        )}
                      </td>


                      <td>

                        {request.urgency ===
                          "Emergency" && (
                          <span className="status-urgent">
                            Emergency
                          </span>
                        )}

                        {request.urgency ===
                          "Urgent" && (
                          <span className="status-urgent">
                            Urgent
                          </span>
                        )}

                        {request.urgency ===
                          "Normal" && (
                          <span className="status-normal">
                            Normal
                          </span>
                        )}

                      </td>


                      <td>

                        <span
                            className={`donor-request-status donor-status-${request.status
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
                          onClick={() => handleAccept(request._id)}
                          disabled={acceptingId === request._id}
                        >
                          {acceptingId === request._id
                            ? "Responding..."
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
                          onClick={() =>
                             setSelectedRequest(request)
                          }
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

      </div>
                
      {selectedRequest && (
      <div className="request-modal-overlay">
        <div className="request-modal">
          <div className="request-modal-header">
            <h2>Blood Request Details</h2>

            <button
              type="button"
              className="request-modal-close"
              onClick={() => setSelectedRequest(null)}
            >
              ×
            </button>
          </div>

        <div className="request-modal-body">
          <div className="request-detail">
              <span>Patient Name</span>
              <strong>{selectedRequest.patientName || "—"}</strong>
            </div>
            
            <div className="request-detail">
              <span>Blood Group</span>

              <strong className="request-detail-blood-group">
                {selectedRequest.bloodGroup}
              </strong>
            </div>
            
            <div className="request-detail">
              <span>Status</span>

              <strong
                className={`request-detail-status donor-status-${selectedRequest.status
                  ?.toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {selectedRequest.status}
              </strong>
            </div>


            <div className="request-detail">
              <span>Units Required</span>
              <strong>
                {selectedRequest.unitsRequired} Unit
                {selectedRequest.unitsRequired !== 1 ? "s" : ""}
              </strong>
            </div>

            <div className="request-detail">
            <span>Urgency</span>

            <strong
              className={`request-detail-urgency request-urgency-${selectedRequest.urgency
                ?.toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {selectedRequest.urgency || "—"}
            </strong>
          </div>
          
            <div className="request-detail">
              <span>Required Date</span>
              <strong>{formatDate(selectedRequest.requiredDate)}</strong>
            </div>

            
            <div className="request-detail">
              <span>Hospital</span>
              <strong>{selectedRequest.hospitalName || "—"}</strong>
            </div>

            <div className="request-detail">
              <span>Location</span>
              <strong>{getLocation(selectedRequest) || "—"}</strong>
            </div>
          </div>

          <div className="request-modal-footer">
            <button
              type="button"
              className="request-modal-btn"
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
    type={popupType}
    title={
      popupType === "success"
        ? "Request Accepted"
        : undefined
    }
    icon={
      popupType === "success"
        ? ""
        : undefined
    }
    message={popupMessage}
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

export default BloodRequests;