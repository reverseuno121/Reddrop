import { useState } from "react";
import {Link,useNavigate,useSearchParams,} from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LocationSelector from "../components/LocationSelector";
import MessagePopup from "../components/MessagePopup";

import AuthLayout from "../layouts/AuthLayout";
import "../styles/Auth.css";


function Register() {
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Step 1 - Basic Account
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Step 2 - Additional Details
  const initialRole = searchParams.get("role");
  const [role, setRole] = useState(
    initialRole === "donor" || initialRole === "recipient"
      ? initialRole
      : ""
  );  
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  
  //popup
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  
  //popup message
  const showError = (message) => {
    setPopupType("error");
    setPopupMessage(message);
  };

  const showSuccess = (message) => {
    setPopupType("success");
    setPopupMessage(message);
  };

  // STEP 1
  const handleContinue = (e) => {
  e.preventDefault();

  // Phone number validation
  if (!/^\d{10}$/.test(phone)) {
    showError("Phone number must contain exactly 10 digits.");
    return;
  }

  // Password validation
  const passwordPattern =
    /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Z].{7,}$/;

  if (!passwordPattern.test(password)) {
    showError(
      "Password must be at least 8 characters, start with a capital letter, contain at least one number and one special character."
    );
    return;
  }

  // Confirm password
  if (password !== confirmPassword) {
    showError("Password and Confirm Password do not match.");
    return;
  }

  setStep(2);
};
  // STEP 2
 const handleFinalSubmit = async (e) => {
  e.preventDefault();

  if (!role) {
    showError("Please select your role.");
    return;
  }

  if (!gender) {
    showError("Please select your gender.");
    return;
  }

  if (!bloodGroup) {
    showError("Please select your blood group.");
    return;
  }

  if (!dateOfBirth) {
    showError("Please select your date of birth.");
    return;
  }

  if (!state || !district || !city) {
    showError("Please complete your location details.");
    return;
  }

  try {
  setIsSubmitting(true);

  const data = await registerUser({
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    password,
    role,
    dateOfBirth,
    gender,
    bloodGroup,
    state,
    district,
    city,
  });

  // Automatically log in the newly created user
  login(data.token, data.user);

  // Show success popup
    showSuccess("Your account has been created successfully!");
  } catch (error) {
    showError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <AuthLayout
      tag="JOIN THE COMMUNITY"
      title="Become a"
      highlight="Life Saver."
      description="Create your RedDrop account and connect with people who can give or receive the gift of life."
    >
      {/* ================= STEP 1 ================= */}
      {step === 1 && (
        <>
          <h2>Create your account</h2>

          <p className="auth-subtitle">
            Enter your basic account details to continue.
          </p>

          <form onSubmit={handleContinue}>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                type="email"
                id="register-email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
              <div className="form-group">
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your 10-digit phone number"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Allow only numbers and maximum 10 digits
                    if (/^\d{0,10}$/.test(value)) {
                      setPhone(value);
                    }
                  }}
                  inputMode="numeric"
                  maxLength="10"
                  required
                />
              </div>
            {/* Password */}
            <div className="form-group">
              <label htmlFor="register-password">
                Password
              </label>

              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
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

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <div className="password-input">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Continue */}
            <button
              type="submit"
              className="auth-submit-btn"
            >
              Continue
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>
        </>
      )}

      {/* ================= STEP 2 ================= */}
      {step === 2 && (
        <>
          <h2>Enter your details</h2>

          <p className="auth-subtitle">
            Complete your profile information to create your RedDrop account.
          </p>

          <form onSubmit={handleFinalSubmit}>

            {/* Role */}
            <div className="form-group">
              <label>
                Select Role
              </label>

              <div className="role-selection">

                {/* Donor */}
                <button
                  type="button"
                  className={`role-card ${
                    role === "donor" ? "active" : ""
                  }`}
                  onClick={() => setRole("donor")}
                >
                  <span className="role-icon">
                    🩸
                  </span>

                  <span className="role-content">
                    <strong>
                      Donate Blood
                    </strong>

                    <small>
                      I want to help others
                    </small>
                  </span>
                </button>

                {/* Recipient */}
                <button
                  type="button"
                  className={`role-card ${
                    role === "recipient" ? "active" : ""
                  }`}
                  onClick={() => setRole("recipient")}
                >
                  <span className="role-icon">
                    🏥
                  </span>

                  <span className="role-content">
                    <strong>
                      Request Blood
                    </strong>

                    <small>
                      I need blood
                    </small>
                  </span>
                </button>

              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="dateOfBirth">
                Date of Birth
              </label>

              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) =>
                  setDateOfBirth(e.target.value)
                }
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label htmlFor="gender">
                Gender
              </label>

              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value)
                }
                required
              >
                <option value="">
                  Select gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="form-group">
              <label htmlFor="bloodGroup">
                Blood Group
              </label>

              <select
                id="bloodGroup"
                name="bloodGroup"
                value={bloodGroup}
                onChange={(e) =>
                  setBloodGroup(e.target.value)
                }
                required
              >
                <option value="">
                  Select blood group
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
              <div className="form-group">

                <LocationSelector
                  onLocationChange={({ state, district, city }) => {
                    setState(state);
                    setDistrict(district);
                    setCity(city);
                  }}
                />
              </div>

            {/* Terms */}
            <div className="terms">
              <label>
                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the RedDrop terms
                  and privacy policy.
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Submit"}
            </button>
            {/* Back */}
            <button
              type="button"
              className="auth-back-btn"
              onClick={() => setStep(1)}
            >
              ← Back
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </p>

          <Link
            to="/"
            className="back-home"
          >
            ← Back to Home
          </Link>
        </>
      )}

      {popupMessage && (
      <MessagePopup
        title={
          popupType === "success"
            ? "Account Created!"
            : undefined
        }
        message={
          popupType === "success"
            ? ""
            : popupMessage
        }
        type={popupType}
        onClose={() => {
          setPopupMessage("");

          if (popupType === "success") {
            if (role === "donor") {
              navigate("/donor-dashboard");
            } else if (role === "recipient") {
              navigate("/recipient-dashboard");
            }
          }
        }}
      />
    )}
    </AuthLayout>
  );
}

export default Register;