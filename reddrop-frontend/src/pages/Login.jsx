import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

import MessagePopup from "../components/MessagePopup";
import AuthLayout from "../layouts/AuthLayout";

function Login() {
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const [redirectPath, setRedirectPath] = useState("");
  const showError = (message) => {
      setPopupType("error");
      setPopupMessage(message);
    };

  const showSuccess = (message) => {
      setPopupType("success");
      setPopupMessage(message);
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setSubmitting(true);

    const data = await loginUser(email.trim(), password);
    login(data.token, data.user);

    // Decide where the user should go after clicking OK
    if (data.user.role === "donor") {
      setRedirectPath("/donor-dashboard");
    } else if (data.user.role === "recipient") {
      setRedirectPath("/recipient-dashboard");
    } else if (data.user.role === "admin") {
      setRedirectPath("/admin-dashboard");
    }

    showSuccess("Login successful!");
    } catch (error) {
    showError(error.message);
  } finally {
    setSubmitting(false);
  }
};

  return (
    <AuthLayout
      tag="EVERY DROP COUNTS"
      title="Welcome"
      highlight="Back."
      description="Sign in to your RedDrop account and continue making a difference in someone's life."
    >
      <h2>Login to your account</h2>

      <p className="auth-subtitle">
        Enter your details to continue.
      </p>

      <form onSubmit={handleSubmit}>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="form-group">

          <div className="password-label">

            <label htmlFor="password">  
              Password
            </label>

          </div>

          <div className="password-input">

            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              className="show-password"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>

        </div>

        {/* Submit */}
        <button
          type="submit"
          className="auth-submit-btn"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>

      </form>

      <p className="auth-switch">
        Don't have an account?{" "}
        <Link to="/register">
          Create an account
        </Link>
      </p>

      <Link to="/" className="back-home">
        ← Back to Home
      </Link>

          {popupMessage && (
            <MessagePopup
              title={
                popupType === "success"
                  ? "Login successful !"
                  : undefined
              }
              message={popupType === "success" ? "" : popupMessage}
              type={popupType}
              onClose={() => {
                setPopupMessage("");

                if (popupType === "success" && redirectPath) {
                  navigate(redirectPath);
                  setRedirectPath("");
                }
              }}
            />
          )}
    </AuthLayout>
  );
}

export default Login;