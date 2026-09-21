import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/Donations.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";

import {
  getAllDonations,
  createDonation,
  getAdminBloodRequests,
} from "../../services/api";

function Donations() {
  const { token } = useAuth();

  const [donations, setDonations] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    bloodRequest:"",
    donor: "",
    bloodGroup: "",
    donationDate: "",
    hospitalName: "",
    unitsDonated: "1",
    notes: "",
  });

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations(token);

      setDonations(data.donations || []);
    } catch (error) {
      console.error(
        "Admin Donations Error:",
        error.message
      );

      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBloodRequests = async () => {
  try {
    setRequestsLoading(true);

    const data = await getAdminBloodRequests(token);

    const acceptedRequests = (data.requests || []).filter(
      (request) =>
        request.acceptedDonor &&
        request.status === "Donor Assigned"
    );

    setBloodRequests(acceptedRequests);
  } catch (error) {
  console.error("Failed to fetch blood requests:", error);
  showError(error.message);
} finally {
    setRequestsLoading(false);
  }
};

  useEffect(() => {
    if (token) {
      fetchDonations();
      fetchBloodRequests();
    }
  }, [token]);

  const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "bloodRequest") {
    const selectedRequest = bloodRequests.find(
      (request) => request._id === value
    );

    setFormData((current) => ({
      ...current,
      bloodRequest: value,
      donor:
        selectedRequest?.acceptedDonor?._id || "",
      bloodGroup:
        selectedRequest?.acceptedDonor?.bloodGroup || "",
      hospitalName:
        selectedRequest?.hospitalName || "",
      unitsDonated:
        selectedRequest?.unitsRequired?.toString() || "1",
    }));

    return;
  }

  setFormData((current) => ({
    ...current,
    [name]: value,
  }));
};

  const handleCancel = () => {
    setFormData({
      bloodRequest:"",
      donor: "",
      bloodGroup: "",
      donationDate: "",
      hospitalName: "",
      unitsDonated: "1",
      notes: "",
    });

    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.bloodRequest ||
      !formData.donor ||
      !formData.bloodGroup ||
      !formData.donationDate ||
      !formData.hospitalName ||
      !formData.unitsDonated
    ) {
      showError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      await createDonation(token, {
        bloodRequest: formData.bloodRequest,
        donor: formData.donor,
        bloodGroup: formData.bloodGroup,
        donationDate: formData.donationDate,
        hospitalName: formData.hospitalName,
        unitsDonated: Number(formData.unitsDonated),
        notes: formData.notes,
      });

      showSuccess("Donation record created successfully!");

      handleCancel();

      // Refresh donation table
      setLoading(true);
      await fetchDonations();
      await fetchBloodRequests();
    } catch (error) {
      showError(error.message);
      
    } finally {
      setSaving(false);
    }
  };

  const completedDonations = donations.filter(
    (donation) => donation.status === "Completed"
  ).length;

  const cancelledDonations = donations.filter(
    (donation) => donation.status === "Cancelled"
  ).length;

  const totalUnits = donations
  .filter((donation) => donation.status === "Completed")
  .reduce(
    (total, donation) =>
      total + (donation.unitsDonated || 0),
    0
  );

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
      <DashboardLayout role="admin">

        <div className="admin-donations-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              DONATIONS
            </p>

            <h1>
              Loading donations...
            </h1>

            <p>
              Please wait while we fetch donation records.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-donations-page">

        {/* Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            DONATIONS
          </p>

          <h1>
            Donation Records
          </h1>

          <p>
            View and manage blood donation records
            across RedDrop.
          </p>

        </div>


        {/* Statistics */}
        <div className="dashboard-stats">

          <div className="stat-card">

            <div className="stat-icon">
              ❤️
            </div>

            <div>
              <p>
                Total Donations
              </p>

              <h2>
                {donations.length}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✅
            </div>

            <div>
              <p>
                Completed
              </p>

              <h2>
                {completedDonations}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🩸
            </div>

            <div>
              <p>
                Units Donated
              </p>

              <h2>
                {totalUnits}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ❌
            </div>

            <div>
              <p>
                Cancelled
              </p>

              <h2>
                {cancelledDonations}
              </h2>
            </div>

          </div>

        </div>


        {/* Create Donation */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Add Donation Record
              </h2>

              <p>
                Record a blood donation from a donor who responded to a request.
              </p>

            </div>

            {!showForm && (
              <button
                type="button"
                className="dashboard-action"
                onClick={() => setShowForm(true)}
              >
                + Add Donation
              </button>
            )}

          </div>


          {showForm && (
            <form
              className="donation-form"
              onSubmit={handleSubmit}
            >
              <div className="donation-form-field">

                  <label>
                    Blood Request
                  </label>

                  <select
                    name="bloodRequest"
                    value={formData.bloodRequest}
                    onChange={handleChange}
                    disabled={requestsLoading || saving}
                    required
                  >
                    <option value="">
                      {requestsLoading
                        ? "Loading requests..."
                        : "Select accepted request"}
                    </option>

                    {bloodRequests.map((request) => (
                      <option
                        key={request._id}
                        value={request._id}
                      >
                        {request.patientName} -{" "}
                        {request.bloodGroup} -{" "}
                        {request.unitsRequired} unit
                        {request.unitsRequired !== 1
                          ? "s"
                          : ""}
                      </option>
                    ))}
                  </select>

                </div>

              {/* Donor */}
              <div className="donation-form-field">
                  <label>
                    Donor
                  </label>

                  <input
                    type="text"
                    value={
                      bloodRequests.find(
                        (request) =>
                          request._id === formData.bloodRequest
                      )?.acceptedDonor?.name || ""
                    }
                    placeholder="Select blood request first"
                    readOnly
                  />

                </div>


              {/* Blood Group */}
              <div className="donation-form-field">

                <label>
                  Donor Blood Group
                </label>

                <input
                  type="text"
                  value={formData.bloodGroup}
                  readOnly
                  placeholder="Select donor first"
                />

              </div>


              {/* Donation Date */}
              <div className="donation-form-field">

                <label>
                  Donation Date
                </label>

                <input
                  type="date"
                  name="donationDate"
                  value={formData.donationDate}
                  onChange={handleChange}
                  disabled={saving}
                  required
                />

              </div>


              {/* Hospital */}
              <div className="donation-form-field">

                <label>
                  Hospital Name
                </label>

                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="Enter hospital name"
                  disabled={saving}
                  required
                />

              </div>


              {/* Units */}
              <div className="donation-form-field">

                <label>
                  Units Donated
                </label>

                <input
                  type="number"
                  name="unitsDonated"
                  value={formData.unitsDonated}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  disabled={saving}
                  required
                />

              </div>


              {/* Notes */}
              <div className="donation-form-field donation-notes-field">

                <label>
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional notes"
                  rows="3"
                  disabled={saving}
                />

              </div>


              {/* Actions */}
              <div className="donation-form-actions">

                <button
                  type="button"
                  className="donation-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="donation-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Donation"}
                </button>

              </div>

            </form>
          )}

        </div>


        {/* Donations Table */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                All Donations
              </h2>

              <p>
                Complete list of blood donation records.
              </p>

            </div>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>

                <tr>
                  <th>Donor</th>
                  <th>Blood Group</th>
                  <th>Date</th>
                  <th>Hospital</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {donations.length === 0 ? (

                  <tr>

                    <td colSpan="6">
                      No donation records available.
                    </td>

                  </tr>

                ) : (

                  donations.map((donation) => (

                    <tr key={donation._id}>

                      <td>
                        {donation.donor?.name ||
                          "Unknown"}
                      </td>

                      <td>
                        <strong className="blood-group">
                          {donation.bloodGroup}
                        </strong>
                      </td>

                      <td>
                        {formatDate(
                          donation.donationDate
                        )}
                      </td>

                      <td>
                        {donation.hospitalName}
                      </td>

                      <td>
                        {donation.unitsDonated}
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

      </div>
      {popupMessage && (
  <MessagePopup
    type={popupType}
    title={
      popupType === "success"
        ? "Donation Accepted"
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
    </DashboardLayout>
  );
}

export default Donations;