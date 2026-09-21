import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import "./styles/Users.css";
import MessagePopup from "../../components/MessagePopup";

import { useAuth } from "../../context/AuthContext";
import { getAllUsers } from "../../services/api";

function Users() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

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
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token);

        setUsers(data.users);
      } catch (error) {
        console.error(
          "Admin Users Error:",
          error.message
        );

        showError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue) ||
      user.phone?.includes(search);

    const userRole =
      user.role.charAt(0).toUpperCase() +
      user.role.slice(1);

    const matchesRole =
      roleFilter === "All" ||
      userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  const donors = users.filter(
    (user) => user.role === "donor"
  ).length;

  const recipients = users.filter(
    (user) => user.role === "recipient"
  ).length;

  // We don't currently have an account-status field
  // in the User model, so all registered users are
  // treated as active for now.
  const activeUsers = users.length;

  if (loading) {
    return (
      <DashboardLayout role="admin">

        <div className="admin-users-page">

          <div className="dashboard-welcome">

            <p className="section-tag">
              USER MANAGEMENT
            </p>

            <h1>
              Loading users...
            </h1>

            <p>
              Please wait while we fetch registered users.
            </p>

          </div>

        </div>

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">

      <div className="admin-users-page">

        {/* Page Header */}
        <div className="dashboard-welcome">

          <p className="section-tag">
            USER MANAGEMENT
          </p>

          <h1>
            Users
          </h1>

          <p>
            View and manage all donors and recipients
            registered on RedDrop.
          </p>

        </div>


        {/* Statistics */}
        <div className="admin-user-stats">

          <div className="admin-user-stat">

            <span>
              👥
            </span>

            <div>
              <p>
                Total Users
              </p>

              <strong>
                {users.length}
              </strong>
            </div>

          </div>


          <div className="admin-user-stat">

            <span>
              🩸
            </span>

            <div>
              <p>
                Donors
              </p>

              <strong>
                {donors}
              </strong>
            </div>

          </div>


          <div className="admin-user-stat">

            <span>
              🏥
            </span>

            <div>
              <p>
                Recipients
              </p>

              <strong>
                {recipients}
              </strong>
            </div>

          </div>


          <div className="admin-user-stat">

            <span>
              ✓
            </span>

            <div>
              <p>
                Active Users
              </p>

              <strong>
                {activeUsers}
              </strong>
            </div>

          </div>

        </div>


        {/* Users Table */}
        <div className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                All Users
              </h2>

              <p>
                Manage registered RedDrop users.
              </p>

            </div>

          </div>


          {/* Filters */}
          <div className="admin-user-filters">

            <div className="admin-search-box">

              <label>
                Search Users
              </label>

              <input
                type="text"
                placeholder="Search by name, email or phone..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>


            <div className="admin-role-filter">

              <label>
                Role
              </label>

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
              >

                <option value="All">
                  All Users
                </option>

                <option value="Donor">
                  Donors
                </option>

                <option value="Recipient">
                  Recipients
                </option>

              </select>

            </div>

          </div>


          {/* Table */}
          <div className="dashboard-table-wrapper">

            <table className="dashboard-table admin-users-table">

              <thead>

                <tr>
                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Role
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

                {filteredUsers.length > 0 ? (

                  filteredUsers.map((user) => {

                    const displayRole =
                      user.role
                        .charAt(0)
                        .toUpperCase() +
                      user.role.slice(1);

                    return (
                      <tr key={user._id}>

                        <td>
                          <strong>
                            {user.name}
                          </strong>
                        </td>


                        <td>
                          {user.email}
                        </td>


                        <td>
                          {user.phone}
                        </td>


                        <td>
                          <span
                            className={`admin-role-badge ${
                              user.role === "donor"
                                ? "role-donor"
                                : "role-recipient"
                            }`}
                          >
                            {displayRole}
                          </span>
                        </td>


                        <td>
                          <span className="admin-status-active">
                            Active
                          </span>
                        </td>


                        <td>
                          <button
                            type="button"
                            className="admin-view-btn"
                            onClick={() => setSelectedUser(user)}
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
                      colSpan="6"
                      className="admin-no-users"
                    >
                      No users found.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {selectedUser && (
  <div className="admin-user-modal">
    <div className="admin-user-modal-box">

      <div className="admin-user-modal-header">
          <div>
            <h2>User Details</h2>

            <span
              className={`admin-role-badge ${
                selectedUser.role === "donor"
                  ? "role-donor"
                  : "role-recipient"
              }`}
            >
              {selectedUser.role
                ? selectedUser.role.charAt(0).toUpperCase() +
                  selectedUser.role.slice(1)
                : "—"}
            </span>
          </div>

          <button
            type="button"
            className="admin-user-modal-close"
            onClick={() => setSelectedUser(null)}
          >
            ×
          </button>
        </div>

        <div className="admin-user-modal-body">

        <div className="admin-user-modal-detail">
          <span>Blood Group</span>
          <strong className="user-modal-blood-group">
            {selectedUser.bloodGroup || "Not specified"}
          </strong>
        </div>

        <div className="admin-user-modal-detail">
          <span>Name</span>
          <strong>{selectedUser.name || "—"}</strong>
        </div>

        <div className="admin-user-modal-detail">
          <span>Email</span>
          <strong>{selectedUser.email || "—"}</strong>
        </div>

        <div className="admin-user-modal-detail">
          <span>Phone</span>
          <strong>
            {selectedUser.phone || "Not available"}
          </strong>
        </div>

        <div className="admin-user-modal-detail">
          <span>Location</span>
          <strong>
            {[
              selectedUser.city,
              selectedUser.district,
              selectedUser.state,
            ]
              .filter(Boolean)
              .join(", ") || "Not specified"}
          </strong>
        </div>

        <div className="admin-user-modal-detail">
          <span>Status</span>
          <strong className="admin-status-active">
            Active
          </strong>
        </div>

      </div>

      <div className="admin-user-modal-actions">

        {selectedUser.phone && (
          <a
            href={`tel:${selectedUser.phone}`}
            className="admin-user-call-btn"
          >
            Call User
          </a>
        )}

        <button
          type="button"
          className="admin-user-modal-close-btn"
          onClick={() => setSelectedUser(null)}
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

export default Users;