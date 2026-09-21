import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/DonorProfile.css";

import { useAuth } from "../../context/AuthContext";
import ChangePassword from "../../components/ChangePassword";
import MessagePopup from "../../components/MessagePopup";

import {
  getDonorProfile,
  updateDonorProfile,
  getDonorAvailability,
  getMyDonations,
} from "../../services/api";

function DonorProfile() {
  const { token, updateUser } = useAuth();

  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);

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
  gender: "",
  dateOfBirth: "",
  bloodGroup: "",
  state: "",
  district: "",
  city: "",
});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [
          profileData,
          availabilityData,
          donationsData,
        ] = await Promise.all([
          getDonorProfile(token),
          getDonorAvailability(token),
          getMyDonations(token),
        ]);

        const donorData = {
          ...profileData.donor,
          availability: availabilityData.availability,
        };

        setDonor(donorData);
        setDonations(donationsData.donations || []);

        setFormData({
          name: profileData.donor.name || "",
          phone: profileData.donor.phone || "",
          gender: profileData.donor.gender || "",
          dateOfBirth: profileData.donor.dateOfBirth || "",
          bloodGroup: profileData.donor.bloodGroup || "",
          state: profileData.donor.state || "",
          district: profileData.donor.district || "",
          city: profileData.donor.city || "",
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

  const handleEdit = () => {
    if (!donor) return;

    setFormData({
  name: donor.name || "",
  phone: donor.phone || "",
  gender: donor.gender || "",
  dateOfBirth: donor.dateOfBirth || "",
  bloodGroup: donor.bloodGroup || "",
  state: donor.state || "",
  district: donor.district || "",
  city: donor.city || "",
});

    setEditing(true);
  };

  const handleCancel = () => {
    if (!donor) return;

    setFormData({
  name: donor.name || "",
  phone: donor.phone || "",
  gender: donor.gender || "",
  dateOfBirth: donor.dateOfBirth || "",
  bloodGroup: donor.bloodGroup || "",
  state: donor.state || "",
  district: donor.district || "",
  city: donor.city || "",
});

    setEditing(false);
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
      
      const data = await updateDonorProfile(token, {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      });

      setDonor((current) => ({
        ...data.donor,
        availability: current?.availability ?? true,
      }));

      updateUser({
        name: data.donor.name,
        email: data.donor.email,
        phone: data.donor.phone,
        role: data.donor.role,
        gender: data.donor.gender,
        dateOfBirth: data.donor.dateOfBirth,
        bloodGroup: data.donor.bloodGroup,
        state: data.donor.state,
        district: data.donor.district,
        city: data.donor.city,
      });

      setFormData({
        name: data.donor.name || "",
        phone: data.donor.phone || "",
        gender: data.donor.gender || "",
        dateOfBirth: data.donor.dateOfBirth || "",
        bloodGroup: data.donor.bloodGroup || "",
        state: data.donor.state || "",
        district: data.donor.district || "",
        city: data.donor.city || "",
      });

      setEditing(false);

      showSuccess("Profile updated successfully!");
    } catch (error) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const completedDonations = donations
    .filter((donation) => donation.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.donationDate) -
        new Date(a.donationDate)
    );

  const totalDonations = completedDonations.length;

  const lastDonation =
    completedDonations.length > 0
      ? completedDonations[0].donationDate
      : null;

  const formatDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const locationText = [
    donor?.city,
    donor?.district,
    donor?.state,
  ]
    .filter(Boolean)
    .join(", ");

  if (loading) {
    return (
      <DashboardLayout role="donor">
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
    <DashboardLayout role="donor">

      <div className="donor-profile-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            MY PROFILE
          </p>

          <h1>
            Donor Profile
          </h1>

          <p>
            Manage your personal and donation information.
          </p>

        </div>


        <div className="profile-section">

          {/* Profile Header */}
          <div className="profile-header">

            <div className="profile-avatar">
              {donor?.name
                ? donor.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>

              <h2>
                {donor?.name || "User"}
              </h2>

              <p>
                Blood Donor
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
                  onClick={handleEdit}
                >
                  Edit Profile
                </button>
              )}

            </div>


            <div className="profile-grid">

              {/* Full Name */}
              <div className="profile-field">

                <span>
                  Full Name
                </span>

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
                    {donor?.name || "Not specified"}
                  </strong>
                )}

              </div>


              {/* Email */}
              <div className="profile-field">

                <span>
                  Email Address
                </span>

                <strong>
                  {donor?.email || "Not specified"}
                </strong>

              </div>


              {/* Phone */}
              <div className="profile-field">

                <span>
                  Phone Number
                </span>

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
                    {donor?.phone || "Not specified"}
                  </strong>
                )}

              </div>


              {/* Gender */}
              <div className="profile-field">

                <span>
                  Gender
                </span>

                <strong>
                  {donor?.gender || "Not specified"}
                </strong>
              </div>


              {/* Date of Birth */}
              <div className="profile-field">

                <span>
                  Date of Birth
                </span>

                <strong>
                  {donor?.dateOfBirth
                    ? formatDate(donor.dateOfBirth)
                    : "Not specified"}
                </strong>
              </div>


              {/* Location */}
              <div className="profile-field">

                <span>
                  Location
                </span>

                <strong>
                  {locationText || "Not specified"}
                </strong>

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

          </div>


          {/* Donation Information */}
          <div className="profile-block">

            <div className="profile-block-header">

              <h3>
                Donation Information
              </h3>

            </div>


            <div className="profile-grid">

              {/* Blood Group */}
              <div className="profile-field">

                <span>
                  Blood Group
                </span>

                <strong className="blood-group">
                  {donor?.bloodGroup ||
                    "Not specified"}
                </strong>

              </div>


              {/* Donor Status */}
              <div className="profile-field">

                <span>
                  Donor Status
                </span>

                <strong
                  className={
                    donor?.availability
                      ? "available-text"
                      : ""
                  }
                >
                  {donor?.availability
                    ? "● Available"
                    : "● Not Available"}
                </strong>

              </div>


              {/* Total Donations */}
              <div className="profile-field">

                <span>
                  Total Donations
                </span>

                <strong>
                  {totalDonations}
                </strong>

              </div>


              {/* Last Donation */}
              <div className="profile-field">

                <span>
                  Last Donation
                </span>

                <strong>
                  {formatDate(lastDonation)}
                </strong>

              </div>

            </div>

          </div>


          {/* Account Security */}
          <div className="donor-security-card">

            <div>

              <h3>
                Account Security
              </h3>

              <p>
                Keep your donor account secure.
              </p>

            </div>

            <ChangePassword
              className="donor-password-btn"
            />

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

export default DonorProfile;