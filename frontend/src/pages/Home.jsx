import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Home.css";

function Home() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString();
  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="home-wrapper">
      <div className="home-card">

        {/* LEFT SIDE */}
        <div className="left-section">

          <h2>Track Your Expenses</h2>

          <div className="date-time">
            <p><h3>Date:</h3>{formattedDate}</p>
            <p><h3>Time:</h3>{formattedTime}</p>
          </div>
          <div className="features">
          <h2>Welcome back!</h2>
          <h3>Sign in to continue your journey with us.</h3>
          </div>
          

          <Link to="/register">
            <button className="signup-btn">Sign up</button>
          </Link>

        </div>

        {/* RIGHT SIDE */}
        <div className="right-section">
          <div className="right-content">
            <h1>Get Started</h1>
            <p>Already have an account?</p>

            <Link to="/login">
              <button className="login-btn">Log in</button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;