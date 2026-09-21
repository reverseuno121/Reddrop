import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/Donors.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";

import {
  getAllDonors,
  getAllDonations,
} from "../../services/api";

function Donors() {
  const { token } = useAuth();

  const [donors, setDonors] = useState([]);
  const [donations, setDonations] = useState([]);

  const [search, setSearch] = useState("");
  const [bloodGroup, setBloodGroup] = useState("All");
  const [status, setStatus] = useState("All");

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

  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const [donorData, donationData] = await Promise.all([
          getAllDonors(token),
          getAllDonations(token),
        ]);

        setDonors(donorData.donors || []);
        setDonations(donationData.donations || []);
      } catch (error) {
        console.error(
          "Admin Donors Error:",
          error.message
        );

        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonors();
    }
  }, [token]);

  const filteredDonors = donors.filter((donor) => {
    const searchValue = search.toLowerCase();

    const location = [
      donor.city || "",
      donor.district || "",
      donor.state || "",
    ]
      .join(", ")
      .toLowerCase();

    const matchesSearch =
      donor.name?.toLowerCase().includes(searchValue) ||
      donor.email?.toLowerCase().includes(searchValue) ||
      donor.phone?.includes(searchValue) ||
      location.includes(searchValue);

    const matchesBloodGroup =
      bloodGroup === "All" ||
      donor.bloodGroup === bloodGroup;

    const donorStatus =
      donor.availability === true
        ? "Available"
        : "Unavailable";

    const matchesStatus =
      status === "All" ||
      donorStatus === status;

    return (
      matchesSearch &&
      matchesBloodGroup &&
      matchesStatus
    );
  });

  const availableDonors = donors.filter(
    (donor) => donor.availability === true
  ).length;

  const unavailableDonors = donors.filter(
    (donor) => donor.availability !== true
  ).length;

  const bloodGroupsCount = new Set(
    donors
      .map((donor) => donor.bloodGroup)
      .filter(Boolean)
  ).size;

const getLocation = (donor) => {
  const city = donor.city || "";
  const district = donor.district || "";
  const state = donor.state || "";

  return [city, district, state]
    .filter(Boolean)
    .join(", ") || "Not specified";
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getLastDonationDate = (donorId) => {
  const donorDonations = donations
    .filter((donation) => {
      const donationDonorId =
        typeof donation.donor === "object"
          ? donation.donor?._id
          : donation.donor;

      return donationDonorId === donorId;
    })
    .filter((donation) => donation.status === "Completed")
    .sort(
      (a, b) =>
        new Date(b.donationDate) -
        new Date(a.donationDate)
    );

  return donorDonations[0]?.donationDate || null;
};
  if (loading) {
    return (
      <DashboardLayout role="admin">

        <div className="admin-donors-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              DONOR MANAGEMENT
            </p>

            <h1>
              Loading donors...
            </h1>

            <p>
              Please wait while we fetch registered donors.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-donors-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            DONOR MANAGEMENT
          </p>

          <h1>
            Donors
          </h1>

          <p>
            View and manage registered blood donors.
          </p>

        </div>


        {/* Statistics */}
        <div className="admin-donor-stats">

          <div className="admin-donor-stat">

            <span>
              🩸
            </span>

            <div>
              <p>
                Total Donors
              </p>

              <strong>
                {donors.length}
              </strong>
            </div>

          </div>


          <div className="admin-donor-stat">

            <span>
              ✓
            </span>

            <div>
              <p>
                Available
              </p>

              <strong>
                {availableDonors}
              </strong>
            </div>

          </div>


          <div className="admin-donor-stat">

            <span>
              ○
            </span>

            <div>
              <p>
                Unavailable
              </p>

              <strong>
                {unavailableDonors}
              </strong>
            </div>

          </div>


          <div className="admin-donor-stat">

            <span>
              ❤️
            </span>

            <div>
              <p>
                Blood Groups
              </p>

              <strong>
                {bloodGroupsCount}
              </strong>
            </div>

          </div>

        </div>


        {/* Donor List */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>
              <h2>
                All Donors
              </h2>

              <p>
                Search and filter registered donors.
              </p>
            </div>

          </div>


          {/* Filters */}
          <div className="admin-donor-filters">

            <div className="admin-donor-search">

              <label>
                Search
              </label>

              <input
                type="text"
                placeholder="Search donor, email, phone or location..."                value={search}
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

                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>

              </select>

            </div>

          </div>


          {/* Table */}
          <div className="dashboard-table-wrapper">

            <table className="dashboard-table admin-donors-table">

              <thead>

                <tr>

                  <th>
                    Donor
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Blood Group
                  </th>

                  <th>
                    Location
                  </th>

                  <th>
                    Last Donation
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredDonors.length > 0 ? (

                  filteredDonors.map((donor) => {

                    const donorDonations = donations
                    .filter((donation) => {
                      const donorId =
                        typeof donation.donor === "object"
                          ? donation.donor?._id
                          : donation.donor;

                      return donorId === donor._id;
                    })
                    .filter((donation) => donation.status === "Completed")
                    .sort(
                      (a, b) =>
                        new Date(b.donationDate) -
                        new Date(a.donationDate)
                    );

                  const lastDonation = donorDonations[0]?.donationDate;

                    const donorStatus =
                      donor.availability === true
                        ? "Available"
                        : "Unavailable";

                    return (
                      <tr key={donor._id}>

                        <td>
                          <strong>
                            {donor.name}
                          </strong>
                        </td>


                        <td>
                          {donor.email}
                        </td>


                        <td>

                          {donor.bloodGroup ? (
                            <span className="donor-blood-group">
                            {donor.bloodGroup}
                          </span>
                        ) : (
                          <span className="donor-blood-group-empty">
                            Not specified
                          </span>
                        )}

                        </td>


                        <td>
                          {getLocation(donor)}
                        </td>


                        <td>
                          {formatDate(lastDonation)}
                        </td>

                        <td>

                          <span
                            className={
                              donorStatus ===
                              "Available"
                                ? "donor-status-available"
                                : "donor-status-unavailable"
                            }
                          >
                            {donorStatus}
                          </span>

                        </td>


                        <td>

                          <button
                            type="button"
                            className="admin-donor-view-btn"
                            onClick={() => setSelectedDonor(donor)}
                          >
                            View
                          </button>

                        </td>

                      </tr>
                    );
                  })

                ) : (

                  <tr>

                    <td
                      colSpan="7"
                      className="admin-no-donors"
                    >
                      No donors found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {selectedDonor && (
  <div className="admin-donor-modal">
    <div className="admin-donor-modal-box">

      <div className="admin-donor-modal-header">
        <div>
          <h2>Donor Details</h2>

          <span
            className={
              selectedDonor.availability
                ? "donor-status-available"
                : "donor-status-unavailable"
            }
          >
            {selectedDonor.availability
              ? "Available"
              : "Unavailable"}
          </span>
        </div>

        <button
          type="button"
          className="admin-donor-modal-close"
          onClick={() => setSelectedDonor(null)}
        >
          ×
        </button>
      </div>

      <div className="admin-donor-modal-body">

        <div className="admin-donor-modal-detail">
          <span>Name</span>
          <strong>{selectedDonor.name || "—"}</strong>
        </div>

        <div className="admin-donor-modal-detail">
          <span>Email</span>
          <strong>{selectedDonor.email || "—"}</strong>
        </div>

        <div className="admin-donor-modal-detail">
          <span>Phone</span>
          <strong>
            {selectedDonor.phone || "Not available"}
          </strong>
        </div>

        <div className="admin-donor-modal-detail">
          <span>Blood Group</span>
          <strong className="donor-blood-group">
            {selectedDonor.bloodGroup || "Not specified"}
          </strong>
        </div>

        <div className="admin-donor-modal-detail">
          <span>Location</span>
          <strong>{getLocation(selectedDonor)}</strong>
        </div>

        <div className="admin-donor-modal-detail">
          <span>Last Donation</span>
          <strong>
            {formatDate(
              getLastDonationDate(selectedDonor._id)
            )}
          </strong>
        </div>
      </div>

      <div className="admin-donor-modal-actions">

        {selectedDonor.phone && (
          <a
            href={`tel:${selectedDonor.phone}`}
            className="admin-donor-call-btn"
          >
            Call Donor
          </a>
        )}

        <button
          type="button"
          className="admin-donor-modal-close-btn"
          onClick={() => setSelectedDonor(null)}
        >
          Close
        </button>

      </div>

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

    </DashboardLayout>
  );
}

export default Donors;