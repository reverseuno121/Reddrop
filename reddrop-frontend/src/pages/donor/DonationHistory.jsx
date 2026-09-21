import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/DonationHistory.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import {
  getDonorProfile,
  getMyDonations,
} from "../../services/api";

function DonationHistory() {
  const { token } = useAuth();

  const [donor, setDonor] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchDonationHistory = async () => {
      try {
        const [profileData, donationData] =
          await Promise.all([
            getDonorProfile(token),
            getMyDonations(token),
          ]);

        setDonor(profileData.donor);
        setDonations(donationData.donations || []);
        
      } catch (error) {
        console.error(
          "Donation History Error:",
          error.message
        );

        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDonationHistory();
    }
  }, [token]);

  const sortedDonations = [...donations].sort(
    (a, b) =>
      new Date(b.donationDate) -
      new Date(a.donationDate)
  );

  const completedDonations = sortedDonations.filter(
    (donation) => donation.status === "Completed"
  );

  const totalDonations = completedDonations.length;

  const lastDonation =
    completedDonations.length > 0
      ? completedDonations[0]
      : null;

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
      <DashboardLayout role="donor">

        <div className="donation-history-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              DONATION HISTORY
            </p>

            <h1>
              Loading donations...
            </h1>

            <p>
              Please wait while we fetch your donation
              history.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="donor">

      <div className="donation-history-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            DONATION HISTORY
          </p>

          <h1>
            My Donations
          </h1>

          <p>
            View your previous blood donations and their
            details.
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
                {totalDonations}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🩸
            </div>

            <div>
              <p>
                Blood Group
              </p>

              <h2>
                {donor?.bloodGroup || "Not Set"}
              </h2>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              📅
            </div>

            <div>
              <p>
                Last Donation
              </p>

              <h2>
                {lastDonation
                  ? formatDate(
                      lastDonation.donationDate
                    )
                  : "—"}
              </h2>
            </div>

          </div>

        </div>


        {/* Donation History */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Donation Records
              </h2>

              <p>
                Your complete blood donation history.
              </p>

            </div>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>

                <tr>
                  <th>Date</th>
                  <th>Hospital / Location</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                </tr>

              </thead>


              <tbody>

                {donations.length === 0 ? (

                  <tr>

                    <td colSpan="5">
                      No donation records available.
                    </td>

                  </tr>

                ) : (

                sortedDonations.map((donation) => (
                    <tr key={donation._id}>

                      <td>
                        {formatDate(
                          donation.donationDate
                        )}
                      </td>

                      <td>
                        {donation.hospitalName}
                      </td>

                      <td>
                        {donation.bloodGroup}
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
    message={popupMessage}
    type={popupType}
    onClose={() => setPopupMessage("")}
  />
)}
    </DashboardLayout>
  );
}

export default DonationHistory;