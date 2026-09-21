import { useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import LocationSelector from "../../components/LocationSelector";
import "./styles/FindDonor.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import { findDonors } from "../../services/api";

function FindDonor() {
  const { token } = useAuth();

  const [bloodGroup, setBloodGroup] = useState("");

  const [location, setLocation] = useState({
    state: "",
    district: "",
    city: "",
  });

  const [hasSearched, setHasSearched] = useState(false);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDonor, setSelectedDonor] = useState(null);

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

  const handleSearch = async () => {
  try {
    setHasSearched(true);
    setLoading(true);
    setDonors([]);

    const data = await findDonors(token, {
      bloodGroup,
      state: location.state,
      district: location.district,
      city: location.city,
    });

    setDonors(data.donors || []);
  } catch (error) {
    showError(error.message);
  } finally {
    setLoading(false);
  }
};

  const handleViewProfile = (donor) => {
    setSelectedDonor(donor);
  };

  const handleCloseProfile = () => {
    setSelectedDonor(null);
  };

  const formatDate = (date) => {
  if (!date) {
    return "Not specified";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  return (
    <DashboardLayout role="recipient">

      {/* Page Header */}
      <div className="dashboard-welcome">

        <p className="section-tag">
          FIND DONOR
        </p>

        <h1>
          Find a Blood Donor 🔎
        </h1>

        <p>
          Search for available blood donors near
          your location.
        </p>

      </div>


      {/* Search Section */}
      <div className="dashboard-section">

        <div className="section-header">

          <div>
            <h2>Search Donors</h2>

            <p>
              Select a blood group and location to find available donors.
            </p>
          </div>

        </div>


        <div className="donor-search-grid">

          {/* Blood Group */}
          <div className="filter-group">

            <label htmlFor="bloodGroup">
              Blood Group
            </label>

            <select
              id="bloodGroup"
              value={bloodGroup}
              onChange={(e) =>
                setBloodGroup(e.target.value)
              }
            >
              <option value="">
                All Blood Groups
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


          {/* Search */}
          <button
            type="button"
            className="filter-btn donor-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "🔎 Search Donors"}
          </button>

        </div>

      </div>


      {/* Results */}
      <div className="dashboard-section">

        <div className="section-header">

          <div>

            <h2>
              Available Donors
            </h2>

            <p>
              {donors.length} donor
              {donors.length !== 1
                ? "s"
                : ""} found
            </p>

          </div>

        </div>
          {!hasSearched ? (
            <div className="no-donors">
              <div>🔎</div>
              <h3>Search for a donor</h3>
              <p>
                Select a blood group and location, then search for available donors.
              </p>
            </div>
          ) : donors.length === 0 ? (
          <div className="no-donors">

            <div>
              🔎
            </div>

            <h3>
              No donors found
            </h3>

            <p>
              Select your required blood group
              and location, then search again.
            </p>

          </div>

        ) : (

          <div className="donor-grid">

            {donors.map((donor) => (

              <div
                className="donor-card"
                key={donor._id}
              >

                <div className="donor-card-header">

                  <div className="donor-avatar">
                    {donor.name
                      ? donor.name
                          .charAt(0)
                          .toUpperCase()
                      : "D"}
                  </div>

                  <div>

                    <h3>
                      {donor.name}
                    </h3>

                    <span className="available-text">
                      ● Available
                    </span>

                  </div>

                </div>


                <div className="donor-details">

                  <div>

                    <span>
                      Blood Group
                    </span>

                    <strong className="blood-group">
                      {donor.bloodGroup ||
                        "Not specified"}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Location
                    </span>

                    <strong>
                      {[
                        donor.city,
                        donor.district,
                        donor.state,
                      ]
                        .filter(Boolean)
                        .join(", ") ||
                        "Not specified"}
                    </strong>

                  </div>

                </div>


                <div className="donor-card-actions">

                  <button
                    type="button"
                    className="table-action"
                    onClick={() =>
                      handleViewProfile(donor)
                    }
                  >
                    View Profile
                  </button>

                  <button
                    type="button"
                    className="contact-btn"
                    onClick={() => {
                      if (donor.phone) {
                        window.location.href =
                          `tel:${donor.phone}`;
                      } else {
                        showError(
                          "Phone number is not available."
                        );
                      }
                    }}
                  >
                    Contact
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* Donor Profile Modal */}
      {selectedDonor && (
        <div className="donor-profile-modal">

          <div className="donor-profile-modal-box">

            <div className="donor-profile-modal-header">

              <div>

                <h2>
                  {selectedDonor.name}
                </h2>

                <span className="available-text">
                  ● Available Donor
                </span>

              </div>

              <button
                type="button"
                className="donor-profile-close"
                onClick={handleCloseProfile}
              >
                ×
              </button>

            </div>


            <div className="donor-profile-modal-details">

              <div>
                <span>
                  Blood Group
                </span>

                      <strong className="blood-group">
                        {selectedDonor.bloodGroup ||
                          "Not specified"}
                      </strong>
                    </div>
                    
                <div>
                    <span>
                      Gender
                    </span>

                    <strong>
                      {selectedDonor.gender ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Date of Birth
                    </span>

                    <strong>
                      {selectedDonor.dateOfBirth
                        ? formatDate(selectedDonor.dateOfBirth)
                        : "Not specified"}
                    </strong>
                  </div>


              <div>
                <span>
                  Phone Number
                </span>

                <strong>
                  {selectedDonor.phone ||
                    "Not available"}
                </strong>
              </div>


              <div>
                <span>
                  State
                </span>

                <strong>
                  {selectedDonor.state ||
                    "Not specified"}
                </strong>
              </div>


              <div>
                <span>
                  District
                </span>

                <strong>
                  {selectedDonor.district ||
                    "Not specified"}
                </strong>
              </div>


              <div>
                <span>
                  City
                </span>

                <strong>
                  {selectedDonor.city ||
                    "Not specified"}
                </strong>
              </div>

            </div>


            <div className="donor-profile-modal-actions">

              {selectedDonor.phone && (
                <a
                  href={`tel:${selectedDonor.phone}`}
                  className="contact-btn"
                >
                  Call Donor
                </a>
              )}

              <button
                type="button"
                className="table-action"
                onClick={handleCloseProfile}
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

export default FindDonor;