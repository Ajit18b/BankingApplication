import React from "react";
import "./Home.css"; // CSS for styling

const Home = () => {
  return (
    <div className="home">
      <header className="home-header">
        <div className="navbar">
          <h1 className="bank-logo">BankX</h1>
          <nav className="nav-links">
            <a href="#about">About Us</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
        <div className="hero-section">
          <h2>Your Trusted Financial Partner</h2>
          <p>
            Manage your finances, track expenses, and grow your wealth with
            BankX.
          </p>
          <button className="cta-btn">Get Started</button>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>Secure Banking</h3>
          <p>
            Experience top-notch security for all your financial transactions.
          </p>
        </div>
        <div className="feature-card">
          <h3>Easy Transfers</h3>
          <p>Transfer funds easily across accounts with minimal fees.</p>
        </div>
        <div className="feature-card">
          <h3>24/7 Support</h3>
          <p>
            Get support anytime, anywhere through our live chat or call center.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
