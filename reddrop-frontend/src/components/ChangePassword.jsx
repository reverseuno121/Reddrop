import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword } from "../services/api";

import "./styles/ChangePassword.css";
import MessagePopup from "./../components/MessagePopup";

function ChangePassword({ className = "change-password-btn" }) {  
  const { token } = useAuth();

  const [showForm, setShowForm] = useState(false);
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

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
        showError("Please fill all password fields.");
      return;
    }

    const passwordPattern =
      /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Z].{7,}$/;

    if (!passwordPattern.test(passwordData.newPassword)) {
      showError(
        "Password must be at least 8 characters, start with a capital letter, contain at least one number and one special character."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
        showError("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      await changePassword(
        token,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      showSuccess("Password changed successfully!");

      handleCancel();
      } catch (error) {
        showError(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
      type="button"
      className={className}
      onClick={() => setShowForm(true)}
      >
        Change Password
      </button>

      {showForm && (
        <div className="change-password-modal">

          <div className="change-password-box">

            <div className="change-password-header">
              <div>
                <h3>Change Password</h3>
                <p>Update your account password.</p>
              </div>

              <button
                type="button"
                className="change-password-close"
                onClick={handleCancel}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="change-password-field">
                <label>Current Password</label>

                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </div>

              <div className="change-password-field">
                <label>New Password</label>

                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="change-password-field">
                <label>Confirm New Password</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              <div className="change-password-actions">

                <button
                  type="button"
                  className="change-password-cancel"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="change-password-save"
                  disabled={saving}
                >
                  {saving ? "Changing..." : "Change Password"}
                </button>

              </div>

            </form>

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
    </>
  );
}

export default ChangePassword;