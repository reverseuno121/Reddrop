import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/RecipientProfile.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import ChangePassword from "../../components/ChangePassword";

import {
  getRecipientProfile,
  updateRecipientProfile,
  getMyBloodRequests,
} from "../../services/api";

function RecipientProfile() {
  const { token ,updateUser } = useAuth();

  const [recipient, setRecipient] = useState(null);
  const [requests, setRequests] = useState([]);

  const [editing, setEditing] = useState(false);
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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    state: "",
    district: "",
    city: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileData, requestsData] =
          await Promise.all([
            getRecipientProfile(token),
            getMyBloodRequests(token),
          ]);

        setRecipient(profileData.recipient);
        setRequests(requestsData.requests);

        setFormData({
          name: profileData.recipient.name || "",
          phone: profileData.recipient.phone || "",
          bloodGroup:
            profileData.recipient.bloodGroup || "",
          state: profileData.recipient.state || "",
          district:
            profileData.recipient.district || "",
          city: profileData.recipient.city || "",
        });
      } catch (error) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async () => {
  if (!formData.name.trim()) {
    showError("Please enter your name.");
    return;
  }

  if (!/^\d{10}$/.test(formData.phone.trim())) {
    showError("Please enter a valid 10-digit phone number.");
    return;
  }

  try {
    setSaving(true);

    const data = await updateRecipientProfile(token, {
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
    });

    setRecipient(data.recipient);

    updateUser({
      name: data.recipient.name,
      email: data.recipient.email,
      phone: data.recipient.phone,
      role: data.recipient.role,
      bloodGroup: data.recipient.bloodGroup,
      state: data.recipient.state,
      district: data.recipient.district,
      city: data.recipient.city,
    });

    setEditing(false);

      showSuccess("Profile updated successfully!");
    } catch (error) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);

    setFormData({
      name: recipient?.name || "",
      phone: recipient?.phone || "",
      bloodGroup:
        recipient?.bloodGroup || "",
      state: recipient?.state || "",
      district:
        recipient?.district || "",
      city:
        recipient?.city || "",
    });
  };

  const totalRequests = requests.length;

  const fulfilledRequests = requests.filter(
    (request) => request.status === "Fulfilled"
  ).length;

  if (loading) {
    return (
      <DashboardLayout role="recipient">
        <div className="dashboard-welcome">
          <p className="section-tag">
            MY PROFILE
          </p>

          <h1>
            Loading profile...
          </h1>

          <p>
            Please wait while we fetch your profile.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="recipient">

      <div className="recipient-profile-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            MY PROFILE
          </p>

          <h1>
            Recipient Profile
          </h1>

          <p>
            Manage your personal information and
            account details.
          </p>

        </div>


        <div className="profile-section">

          {/* Profile Header */}
          <div className="profile-header">

            <div className="profile-avatar">
              {recipient?.name
                ? recipient.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>

              <h2>
                {recipient?.name || "User"}
              </h2>

              <p>
                Blood Recipient
              </p>

            </div>

          </div>


          {/* Personal Information */}
          <div className="profile-block">

            <div className="profile-block-header">

              <h3>
                Personal Information
              </h3>

              {!editing && (
                <button
                  type="button"
                  className="dashboard-action"
                  onClick={() =>
                    setEditing(true)
                  }
                >
                  Edit Profile
                </button>
              )}

            </div>


            <div className="profile-grid">

                {/* Full Name */}
                <div className="profile-field">
                  <span>Full Name</span>

                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  ) : (
                    <strong>
                      {recipient?.name || "Not specified"}
                    </strong>
                  )}
                </div>

                {/* Email */}
                <div className="profile-field">
                  <span>Email Address</span>

                  <strong>
                    {recipient?.email || "Not specified"}
                  </strong>
                </div>

                {/* Phone */}
                <div className="profile-field">
                  <span>Phone Number</span>

                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      inputMode="numeric"
                      required
                    />
                  ) : (
                    <strong>
                      {recipient?.phone || "Not specified"}
                    </strong>
                  )}
                </div>

                {/* Gender */}
                <div className="profile-field">
                  <span>Gender</span>

                  <strong>
                    {recipient?.gender || "Not specified"}
                  </strong>
                </div>

                {/* Date of Birth */}
                <div className="profile-field">
                  <span>Date of Birth</span>

                  <strong>
                    {recipient?.dateOfBirth
                      ? new Date(
                          recipient.dateOfBirth
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "Not specified"}
                  </strong>
                </div>

                {/* Location */}
                <div className="profile-field">
                  <span>Location</span>

                  <strong>
                    {[
                      recipient?.city,
                      recipient?.district,
                      recipient?.state,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Not specified"}
                  </strong>
                </div>

              </div>

          </div>


          {/* Edit Actions */}
          {editing && (
            <div className="profile-edit-actions">

              <button
                type="button"
                className="dashboard-action"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="table-action"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>
          )}


          {/* Account Information */}
          <div className="profile-block">

            <div className="profile-block-header">

              <h3>
                Account Information
              </h3>

            </div>


            <div className="profile-grid">

              <div className="profile-field">
                <span>
                  Account Type
                </span>

                <strong>
                  Recipient
                </strong>
              </div>


              <div className="profile-field">
                <span>
                  Blood Group
                </span>

                <strong className="blood-group">
                  {recipient?.bloodGroup ||
                    "Not specified"}
                </strong>
              </div>


              <div className="profile-field">
                <span>
                  Total Requests
                </span>

                <strong>
                  {totalRequests}
                </strong>
              </div>


              <div className="profile-field">
                <span>
                  Fulfilled Requests
                </span>

                <strong>
                  {fulfilledRequests}
                </strong>
              </div>

            </div>

          </div>

          {/* Account Security */}
            <div className="recipient-security-card">

              <div>
                <h3>Account Security</h3>

                <p>
                  Keep your recipient account secure.
                </p>
              </div>

              <ChangePassword className="recipient-password-btn" />

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

export default RecipientProfile;