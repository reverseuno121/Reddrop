import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span>❤️</span> RedDrop
      </Link>

      <div className="nav-links">
        <a href="/#home">Home</a>
        <a href="/#about">About</a>
        <a href="/#how-it-works">How It Works</a>
        <a href="/#contact">Contact</a>
      </div>

      <div className="nav-buttons">
        <Link to="/login" className="login-btn">
          Login
        </Link>

        <Link to="/register" className="register-btn">
          Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;