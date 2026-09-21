import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css";
function Home() {
  return (
    <div className="app">
      {/*NavBar*/}
       <Navbar />
      {/* Hero Section */}
      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="hero-tag">🩸 Every Drop Counts</p>

            <h1>
              Give Blood.
              <br />
              <span>Save Lives.</span>
            </h1>

            <p className="hero-description">
              RedDrop connects blood donors with people in need.
              Find a donor, request blood, and become a part of
              a life-saving community.
            </p>

            <div className="hero-buttons">
              <Link to="/register?role=donor" className="primary-btn">
                Become a Donor
              </Link>

              <Link to="/register?role=recipient" className="secondary-btn">
                Find Blood
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="blood-drop">🩸</div>

            <h2>Be someone's reason to live.</h2>

            <p>
              Your one donation can make a difference in someone's
              life.
            </p>
          </div>
        </section>

        {/* About Section */}
        <section className="about" id="about">
          <p className="section-tag">ABOUT REDDROP</p>

          <h2>Connecting Donors With Those In Need</h2>

          <p>
            RedDrop is a blood donation management platform designed
            to make it easier for donors and recipients to connect.
          </p>
        </section>

        {/* How It Works */}
        <section className="how-it-works" id="how-it-works">
          <p className="section-tag">HOW IT WORKS</p>

          <h2>Simple. Fast. Life-Saving.</h2>

          <div className="steps">
            <div className="step-card">
              <div className="step-number">01</div>

              <h3>Register</h3>

              <p>
                Create your RedDrop account and provide your basic
                information.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>

              <h3>Find or Donate</h3>

              <p>
                Search for available blood donors or register
                yourself as a donor.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>

              <h3>Save a Life</h3>

              <p>
                Connect with the right person and help someone get
                the blood they need.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer/>
    </div>
  );
}

export default Home;