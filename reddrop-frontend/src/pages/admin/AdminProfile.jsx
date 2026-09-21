import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/api";

import ChangePassword from "../../components/ChangePassword";

import "./styles/AdminProfile.css";

import MessagePopup from "../../components/MessagePopup";

function AdminProfile() {
  const { token , updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const [editProfile, setEditProfile] = useState({
    name: "",
    phone: "",
  });

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
    const loadProfile = async () => {
      try {
        const data = await getAdminProfile(token);

        const admin = data.admin;

        setProfile({
          name: admin.name || "",
          email: admin.email || "",
          phone: admin.phone || "",
          role: admin.role || "",
        });

        setEditProfile({
          name: admin.name || "",
          phone: admin.phone || "",
        });
      } catch (error) {
        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadProfile();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditProfile({
      ...editProfile,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setEditProfile({
      name: profile.name,
      phone: profile.phone,
    });

    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditProfile({
      name: profile.name,
      phone: profile.phone,
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const data = await updateAdminProfile(token, {
        name: editProfile.name,
        phone: editProfile.phone,
      });

      const updatedAdmin = data.admin;

      setProfile({
        name: updatedAdmin.name || "",
        email: updatedAdmin.email || "",
        phone: updatedAdmin.phone || "",
        role: updatedAdmin.role || "",
      });
      updateUser({
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        phone: updatedAdmin.phone,
        role: updatedAdmin.role,
      });

      setEditProfile({
        name: updatedAdmin.name || "",
        phone: updatedAdmin.phone || "",
      });

      setIsEditing(false);

      showSuccess("Profile updated successfully!");
    } catch (error) {
      showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="admin-profile-page">
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-profile-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            ACCOUNT MANAGEMENT
          </p>

          <h1>
            My Profile
          </h1>

          <p>
            View and manage your administrator account information.
          </p>

        </div>

        {/* Profile Card */}
        <div className="admin-profile-card">

          {/* Profile Header */}
          <div className="admin-profile-header">

            <div className="admin-profile-avatar">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "A"}
            </div>

            <div className="admin-profile-heading">

              <h2>
                {profile.name}
              </h2>

              <p>
                {profile.email}
              </p>

              <span>
                ⚙️ Administrator
              </span>

            </div>

          </div>

          {/* Profile Information */}
          <div className="admin-profile-body">

            <div className="admin-profile-section-title">

              <h3>
                Personal Information
              </h3>

              <p>
                Your administrator account details.
              </p>

            </div>

            <div className="admin-profile-form">

              {/* Name */}
              <div className="admin-profile-field">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    isEditing
                      ? editProfile.name
                      : profile.name
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

              {/* Email */}
              <div className="admin-profile-field">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  value={profile.email}
                  disabled
                />

              </div>

              {/* Phone */}
              <div className="admin-profile-field">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={
                    isEditing
                      ? editProfile.phone
                      : profile.phone
                  }
                  onChange={handleChange}
                  disabled={!isEditing}
                />

              </div>

              {/* Role */}
              <div className="admin-profile-field">

                <label>
                  Role
                </label>

                <input
                  type="text"
                  value="Administrator"
                  disabled
                />

              </div>

            </div>

          </div>

          {/* Buttons */}
          <div className="admin-profile-actions">

            {isEditing ? (
              <>
                <button
                  type="button"
                  className="admin-profile-cancel-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="admin-profile-save-btn"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                className="admin-profile-edit-btn"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            )}

          </div>

        </div>

        {/* Security Section */}
        <div className="admin-security-card">

          <div>

            <h3>
              Account Security
            </h3>

            <p>
              Keep your administrator account secure.
            </p>

          </div>

          <ChangePassword className="admin-password-btn" />

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

export default AdminProfile;