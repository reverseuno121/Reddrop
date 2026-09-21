import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/BloodInventory.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import {
  getBloodInventory,
  updateBloodInventory,
} from "../../services/api";

function BloodInventory() {
  const { token } = useAuth();

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingGroup, setEditingGroup] = useState(null);
  const [editUnits, setEditUnits] = useState("");

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
    const fetchInventory = async () => {
      try {
        const data = await getBloodInventory(token);

        setInventory(data.inventory);
      } catch (error) {
        console.error(
          "Blood Inventory Error:",
          error.message
        );

        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchInventory();
    }
  }, [token]);

  const totalAvailable = inventory.reduce(
    (sum, item) => sum + item.unitsAvailable,
    0
  );

  const lowStockGroups = inventory.filter(
    (item) => item.unitsAvailable <= 5
  ).length;

  const getStockStatus = (available) => {
    if (available <= 5) {
      return "Low";
    }

    if (available <= 10) {
      return "Medium";
    }

    return "Good";
  };

  const handleUpdateClick = (item) => {
    setEditingGroup(item.bloodGroup);
    setEditUnits(item.unitsAvailable.toString());
  };

  const handleCancelEdit = () => {
    setEditingGroup(null);
    setEditUnits("");
  };

  const handleSave = async (bloodGroup) => {
    const units = Number(editUnits);

    if (!Number.isInteger(units) || units < 0) {
      showError("Please enter a valid number of units.");
      return;
    }

    try {
      const data = await updateBloodInventory(
        token,
        bloodGroup,
        units
      );

      setInventory((currentInventory) =>
        currentInventory.map((item) =>
          item.bloodGroup === bloodGroup
            ? data.inventory
            : item
        )
      );

      setEditingGroup(null);
      setEditUnits("");

      showSuccess("Blood inventory updated successfully!");
    } catch (error) {
      showError(error.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">

        <div className="admin-blood-inventory-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              INVENTORY MANAGEMENT
            </p>

            <h1>
              Loading inventory...
            </h1>

            <p>
              Please wait while we fetch the blood inventory.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-blood-inventory-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            INVENTORY MANAGEMENT
          </p>

          <h1>
            Blood Inventory
          </h1>

          <p>
            Monitor available blood units and manage
            the blood inventory.
          </p>

        </div>


        {/* Statistics */}
        <div className="inventory-stats">

          <div className="inventory-stat-card">

            <div className="inventory-stat-icon">
              🩸
            </div>

            <div>
              <p>
                Available Units
              </p>

              <h2>
                {totalAvailable}
              </h2>
            </div>

          </div>

          <div className="inventory-stat-card">

            <div className="inventory-stat-icon">
              ⚠️
            </div>

            <div>
              <p>
                Low Stock Groups
              </p>

              <h2>
                {lowStockGroups}
              </h2>
            </div>

          </div>

        </div>


        {/* Inventory Table */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Blood Stock
              </h2>

              <p>
                Current blood units available in the system.
              </p>

            </div>

          </div>


          <div className="dashboard-table-wrapper">

            <table className="dashboard-table inventory-table">

              <thead>

                <tr>

                  <th>
                    Blood Group
                  </th>

                  <th>
                    Available Units
                  </th>

                  <th>
                    Stock Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {inventory.length === 0 ? (

                  <tr>

                    <td colSpan="4">
                      No inventory records available.
                    </td>

                  </tr>

                ) : (

                  inventory.map((item) => {

                    const stockStatus =
                      getStockStatus(
                        item.unitsAvailable
                      );

                    const isEditing =
                      editingGroup ===
                      item.bloodGroup;

                    return (
                      <tr key={item._id}>

                        <td>
                          <span className="inventory-blood-group">
                            {item.bloodGroup}
                          </span>
                        </td>


                        <td>

                          {isEditing ? (

                            <input
                              type="number"
                              min="0"
                              value={editUnits}
                              onChange={(e) =>
                                setEditUnits(
                                  e.target.value
                                )
                              }
                            />

                          ) : (

                            <strong>
                              {item.unitsAvailable}
                            </strong>

                          )}

                        </td>

                        <td>

                          <span
                            className={`inventory-status ${stockStatus.toLowerCase()}`}
                          >
                            {stockStatus}
                          </span>

                        </td>


                        <td>

                          {isEditing ? (

                            <>
                              <button
                                type="button"
                                className="inventory-update-btn"
                                onClick={() =>
                                  handleSave(
                                    item.bloodGroup
                                  )
                                }
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                className="inventory-cancel-btn"
                                onClick={
                                  handleCancelEdit
                                }
                              >
                                Cancel
                              </button>
                            </>

                          ) : (

                            <button
                              type="button"
                              className="inventory-update-btn"
                              onClick={() =>
                                handleUpdateClick(item)
                              }
                            >
                              Update
                            </button>

                          )}

                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* Inventory Information */}
        <div className="inventory-info">

          <div className="inventory-info-icon">
            ℹ️
          </div>

          <div>

            <h3>
              Inventory Information
            </h3>

            <p>
              Available units are blood units currently
              stored and available for fulfilling requests.
              Inventory increases when donations are recorded
              and decreases when blood is issued.
            </p>

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

export default BloodInventory;