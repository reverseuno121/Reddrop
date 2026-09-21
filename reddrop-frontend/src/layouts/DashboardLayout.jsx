import { Link, NavLink, useNavigate } from "react-router-dom";
import "./styles/DashboardLayout.css";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children, role = "donor" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Use logged-in user's role when available
  const currentRole = user?.role || role;

  return (
    <div className="dashboard-layout">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        {/* Logo */}
        <Link to="/" className="dashboard-logo">
          ❤️ RedDrop
        </Link>

        {/* User Role */}
        <div className="dashboard-role">
          {currentRole === "donor" && "🩸 Donor"}
          {currentRole === "recipient" && "🏥 Recipient"}
          {currentRole === "admin" && "⚙️ Admin"}
        </div>

        {/* Navigation */}
        <nav className="dashboard-nav">

          {/* Dashboard */}
          <NavLink
            to={
              currentRole === "donor"
                ? "/donor-dashboard"
                : currentRole === "recipient"
                ? "/recipient-dashboard"
                : "/admin-dashboard"
            }
            end
            className={({ isActive }) =>
              isActive
                ? "dashboard-nav-link active"
                : "dashboard-nav-link"
            }
          >
            <span>▣</span>
            Dashboard
          </NavLink>

          {/* Donor Navigation */}
          {currentRole === "donor" && (
            <>
              <NavLink
                to="/donation-history"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>🩸</span>
                My Donations
              </NavLink>

              <NavLink
                to="/blood-requests"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>📋</span>
                Blood Requests
              </NavLink>

              <NavLink
                to="/donor-profile"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>👤</span>
                My Profile
              </NavLink>
            </>
          )}

          {/* Recipient Navigation */}
          {currentRole === "recipient" && (
            <>
              <NavLink
                to="/find-donor"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>🔎</span>
                Find Donor
              </NavLink>

              <NavLink
                to="/create-blood-request"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>🩸</span>
                Request Blood
              </NavLink>

              <NavLink
                to="/my-requests"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>📋</span>
                My Requests
              </NavLink>

              <NavLink
                to="/recipient-profile"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>👤</span>
                My Profile
              </NavLink>
            </>
          )}

          {/* Admin Navigation */}
          {currentRole === "admin" && (
            <>
              <NavLink
                to="/admin-users"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>👥</span>
                Users
              </NavLink>

              <NavLink
                to="/admin-donors"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>🩸</span>
                Donors
              </NavLink>
              
                <NavLink
                  to="/admin-donations"
                  className={({ isActive }) =>
                    isActive
                      ? "dashboard-nav-link active"
                      : "dashboard-nav-link"
                  }
                >
                  <span>❤️</span>
                  Donations
                </NavLink>

              <NavLink
                to="/admin-blood-requests"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>📋</span>
                Blood Requests
              </NavLink>

              <NavLink
                to="/admin-blood-inventory"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >

                <span>📦</span>
                Blood Inventory
              </NavLink>

              <NavLink
                to="/admin-profile"
                className={({ isActive }) =>
                  isActive
                    ? "dashboard-nav-link active"
                    : "dashboard-nav-link"
                }
              >
                <span>👤</span>
                My Profile
              </NavLink>
            </>
          )}

        </nav>

        {/* Bottom Navigation */}
        <div className="dashboard-bottom">

          <button
            type="button"
            onClick={handleLogout}
            className="dashboard-logout"
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* Main Area */}
      <div className="dashboard-main">

        {/* Topbar */}
        <header className="dashboard-topbar">

          <div>
            <h2>RedDrop</h2>
            <p>Blood Donation Management System</p>
          </div>

          <div className="dashboard-user">

            <div className="user-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="user-info">
              <strong>
                {user?.name || "User"}
              </strong>

              <small>
                {currentRole}
              </small>
            </div>

          </div>

        </header>

        {/* Page Content */}
        <main className="dashboard-content">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;