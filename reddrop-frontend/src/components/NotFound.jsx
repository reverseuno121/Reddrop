import { Link } from "react-router-dom";
import "./styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">

        <div className="not-found-code">
          404
        </div>

        <h1>Page Not Found!</h1>

        <p>
          The page you are looking for does not exist
          or the URL may be incorrect.
        </p>

        <Link to="/" className="not-found-btn">
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default NotFound;