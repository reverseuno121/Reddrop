import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import "./styles/CreateBloodRequest.css";
import MessagePopup from "../../components/MessagePopup";

import DashboardLayout from "../../layouts/DashboardLayout";
import LocationSelector from "../../components/LocationSelector";
import CustomSelect from "../../components/CustomSelect";

import {useAuth }from "../../context/AuthContext";
import { createBloodRequest } from "../../services/api";

function CreateBloodRequest() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [location, setLocation] = useState({
    state: "",
    district: "",
    city: ""
  });
  const [locationResetKey, setLocationResetKey] = useState(0);

  const [formData, setFormData] = useState({
    patientName: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    requiredDate: "",
    urgency: "",
    message: ""
  });

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [submitting, setSubmitting] = useState(false);

  const showError = (message) => {
    setPopupType("error");
    setPopupMessage(message);
  };

  const showSuccess = (message) => {
    setPopupType("success");
    setPopupMessage(message);
  };
  const handlePopupClose = () => {
    setPopupMessage("");
  
    if (popupType === "success") {
      navigate("/my-requests");
    }
  };

  const currentDate = new Date();

  const today = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(
      currentDate.getDate()
    ).padStart(2, "0")}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if(submitting){
    return;
  }

  if (!formData.patientName.trim()) {
    showError("Please enter the patient's name.");
    return;
  }

  if (!formData.hospital.trim()) {
    showError("Please enter the hospital name.");
    return;
  }

  if (!formData.bloodGroup) {
  showError("Please select the required blood group.");
  return;
  }
  if (!formData.units) {
    showError("Please select the required units.");
    return;
  }

  if (!formData.requiredDate) {
    showError("Please select the required date.");
    return;
  }

  if (formData.requiredDate < today) {
    showError("Required date cannot be in the past.");
    return;
  }

  if (
    !location.state ||
    !location.district ||
    !location.city
  ) {
    showError("Please select the complete required location.");
    return;
  }

  try {
    setSubmitting(true);

    const requestData = {
      patientName: formData.patientName.trim(),
      bloodGroup: formData.bloodGroup,
      unitsRequired: parseInt(
        formData.units.replace(/\D/g, ""),
        10
      ),
      hospitalName: formData.hospital.trim(),
      state: location.state,
      district: location.district,
      city: location.city,
      urgency: formData.urgency
        ? formData.urgency.charAt(0).toUpperCase() +
          formData.urgency.slice(1)
        : "Normal",
      requiredDate: formData.requiredDate,
      description: formData.message.trim(),
    };

    await createBloodRequest(token, requestData);

  // Reset all form fields
  setFormData({
    patientName: "",
    bloodGroup: "",
    units: "",
    hospital: "",
    requiredDate: "",
    urgency: "",
    message: "",
  });

  // Reset location fields
  setLocation({
    state: "",
    district: "",
    city: "",
  });
  setLocationResetKey((current) => current + 1);

  showSuccess("Blood request created successfully!");


  } catch (error) {
  showError(error.message);
  } finally {
  setSubmitting(false);
  }
};
  return (
    <DashboardLayout role="recipient">

      {/* Page Header */}
      <div className="dashboard-welcome">
        <p className="section-tag">
          BLOOD REQUEST
        </p>

        <h1>
          Create Blood Request 🩸
        </h1>

        <p>
          Provide the required information to find
          suitable blood donors.
        </p>
      </div>

      {/* Form */}
      <div className="blood-request-form-card">

        <form onSubmit={handleSubmit}>

          {/* Patient Information */}
          <div className="form-section">

            <div className="form-section-title">
              <h2>Patient Information</h2>

              <p>
                Enter the details of the person who
                needs blood.
              </p>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="patientName">
                  Patient Name
                </label>

                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  placeholder="Enter patient's name"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">

                <CustomSelect
                    label="Blood Group Required"
                    value={formData.bloodGroup}
                    placeholder="Select Blood Group"
                    icon="🩸"
                    options={[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-"
                    ]}
                    onChange={(value) =>
                        setFormData({
                        ...formData,
                        bloodGroup: value
                        })
                    }
                />
              </div>

              <div className="form-group">

                <CustomSelect
                    label="Units Required"
                    value={formData.units}
                    placeholder="Select Units"
                    icon="🩸"
                    options={[
                        "1 Unit",
                        "2 Units",
                        "3 Units",
                        "4 Units",
                        "5 Units"
                    ]}
                    onChange={(value) =>
                        setFormData({
                        ...formData,
                        units: value
                        })
                    }
                />
              </div>

              <div className="form-group">
                <label htmlFor="hospital">
                  Hospital / Medical Center
                </label>

                <input
                  type="text"
                  id="hospital"
                  name="hospital"
                  placeholder="Enter hospital name"
                  value={formData.hospital}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

          </div>

          {/* Location */}
          <div className="form-section">

            <div className="form-section-title">
              <h2>Required Location</h2>

              <p>
                Select where the blood is required.
              </p>
            </div>

            <div className="location-form-grid">

              <LocationSelector
                  key={locationResetKey}
                  onLocationChange={setLocation}
                />

            </div>

          </div>

          {/* Request Details */}
          <div className="form-section">

            <div className="form-section-title">
              <h2>Request Details</h2>

              <p>
                Tell donors when and how urgently
                blood is needed.
              </p>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="requiredDate">
                  Required Date
                </label>

                <input
                  type="date"
                  id="requiredDate"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <CustomSelect
                label="Urgency"
                value={
                    formData.urgency
                    ? formData.urgency === "urgent"
                        ? "Urgent"
                        : "Normal"
                    : ""
                }
                placeholder="Select Urgency"
                icon="🚨"
                options={[
                    "Urgent",
                    "Normal"
                ]}
                optionIcons={{
                    Urgent: "🚨",
                    Normal: "🟢"
                }}
                onChange={(value) =>
                    setFormData({
                    ...formData,
                    urgency: value.toLowerCase()
                    })
                }
            />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Additional Message
              </label>

              <textarea
                id="message"
                name="message"
                placeholder="Add any additional information..."
                value={formData.message}
                onChange={handleChange}
                rows="5"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="request-form-actions">

            <Link
              to="/recipient-dashboard"
              className="cancel-btn"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Blood Request"}
            </button>

          </div>

        </form>

      </div>
    {popupMessage && (
  <MessagePopup
    type={popupType}
    title={
      popupType === "success"
        ? "Request Created"
        : undefined
    }
    icon={
      popupType === "success"
        ? "✅"
        : undefined
    }
    message={popupMessage}
    onClose={() => setPopupMessage("")}
  />
)}
    </DashboardLayout>
  );
}

export default CreateBloodRequest;