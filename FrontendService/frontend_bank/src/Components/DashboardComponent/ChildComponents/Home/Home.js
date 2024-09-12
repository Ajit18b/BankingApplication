import React, { useState, useEffect } from "react";
import { useSidebar } from "../../../../Utils/SidebarContext";
import { Link } from "react-router-dom";
import "./Home.css"; // CSS for styling

const Home = () => {
  useEffect(() => {
    // Scroll to top when component is rendered
    window.scrollTo(0, 0);
  }, []);
  const { toggleSidebar } = useSidebar();
  const [isAboutPopupVisible, setAboutPopupVisible] = useState(false);
  const [isServicesPopupVisible, setServicesPopupVisible] = useState(false);
  const [isContactPopupVisible, setContactPopupVisible] = useState(false);

  const handleOpenAboutPopup = () => setAboutPopupVisible(true);
  const handleCloseAboutPopup = () => setAboutPopupVisible(false);

  const handleOpenServicesPopup = () => setServicesPopupVisible(true);
  const handleCloseServicesPopup = () => setServicesPopupVisible(false);

  const handleOpenContactPopup = () => setContactPopupVisible(true);
  const handleCloseContactPopup = () => setContactPopupVisible(false);

  return (
    <div className="home">
      <header className="home-header">
        <div className="navbar">
          <h1 className="bank-logo">BankX</h1>
          <nav className="nav-links">
            <a href="#about" onClick={handleOpenAboutPopup}>
              About Us
            </a>
            <a href="#services" onClick={handleOpenServicesPopup}>
              Services
            </a>
            <a href="#contact" onClick={handleOpenContactPopup}>
              Contact
            </a>
          </nav>
        </div>
        <div className="hero-section">
          <h2>Your Trusted Financial Partner</h2>
          <p>
            Manage your finances, track expenses, and grow your wealth with
            BankX.
          </p>
          <button className="cta-btn" onClick={toggleSidebar}>
            Get Started
          </button>
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

      {isAboutPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={handleCloseAboutPopup}>
              &times;
            </button>
            <h2>About BankX</h2>
            <p>
              BankX is dedicated to revolutionizing the financial services
              industry with our unwavering commitment to providing superior
              banking solutions that are both secure and user-friendly. Our
              mission is to ensure that every customer experiences the highest
              level of security, convenience, and support as they manage their
              finances. At BankX, we understand that financial management is a
              crucial aspect of everyday life. That's why we have designed our
              services to prioritize top-notch security. Our advanced encryption
              technologies and rigorous security protocols are in place to
              safeguard your personal and financial information, ensuring that
              your transactions are protected from unauthorized access and
              fraud. In addition to our commitment to security, we also focus on
              making financial transactions as seamless as possible. Our
              platform offers easy and efficient transfer services that allow
              you to move funds between accounts with minimal fees and maximum
              convenience. Whether you are sending money to a family member or
              managing your business finances, our user-friendly interface
              ensures that you can complete transactions quickly and
              effortlessly. Moreover, we believe in providing exceptional
              support to our customers around the clock. Our dedicated support
              team is available at any time to assist with any inquiries or
              issues you may encounter. Through our live chat and call center
              services, you can reach out to us whenever you need help or
              guidance, ensuring that you receive prompt and effective
              assistance. BankX is driven by the belief that banking should be
              straightforward and accessible for everyone. We continuously
              strive to enhance our services and adapt to the evolving needs of
              our customers. Our goal is to make financial management as simple
              and efficient as possible, empowering you to take control of your
              finances with confidence.
            </p>
          </div>
        </div>
      )}

      {isServicesPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={handleCloseServicesPopup}>
              &times;
            </button>
            <h2>Our Services</h2>
            <p>
              Explore our range of services designed to meet your financial
              needs.
            </p>
            <div className="services-buttons">
              <Link to="/MoneyTransfer" className="service-btn">
                Transfer Money
              </Link>
              <Link to="/TransactionDetails" className="service-btn">
                View and Download Your Transaction Details
              </Link>
              <Link to="/BankAccountDetails" className="service-btn">
                Bank Account Details
              </Link>
              <Link to="/ExpenseTracker" className="service-btn">
                Track All Your Spending
              </Link>
            </div>
          </div>
        </div>
      )}

      {isContactPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={handleCloseContactPopup}>
              &times;
            </button>
            <h2>Contact Us</h2>
            <p>
              If you have any questions or need assistance, please reach out to
              us via the following channels:
            </p>
            <ul>
              <li>Email: support@bankx.com</li>
              <li>Phone: +91-1800-123-4567</li>
              <li>Address: 123 Financial St, Bank City, PIN 456780</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
