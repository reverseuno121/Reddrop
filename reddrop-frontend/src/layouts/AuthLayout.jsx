import { Link } from "react-router-dom";

function AuthLayout({ children, title, highlight, tag, description }) {
  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Left Side */}
        <div className="auth-info">

          <Link to="/" className="auth-logo">
            ❤️ RedDrop
          </Link>

          <div className="auth-info-content">

            <p className="auth-tag">
              {tag}
            </p>

            <h1>
              {title}
              <br />
              <span>{highlight}</span>
            </h1>

            <p>
              {description}
            </p>

            <div className="auth-blood-icon">
              🩸
            </div>

          </div>
        </div>

        {/* Right Side */}
        <div className="auth-form-section">

          <div className="auth-form">

            {/* Mobile Logo */}
            <div className="mobile-logo">
              <Link to="/" className="auth-logo">
                ❤️ RedDrop
              </Link>
            </div>

            {children}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AuthLayout;