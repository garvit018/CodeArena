import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from './footer/Footer';
import image1 from '../../assest/p1.jpg';
import image2 from '../../assest/p2.jpg';
import "./LandingPage.css";
import Navbar from "./nav/Navbar";

const LandingPage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Function to handle Join Now button click
  const handleJoinClick = () => {
    const isLoggedIn = localStorage.getItem("token"); // Check if user is logged in
    if (isLoggedIn) {
      navigate("/problemtable");  // Redirect to problems page if logged in
    } else {
      navigate("/login");  // Redirect to login page if not logged in
    }
  };

  return (
    <>
    <Navbar />
      <div className="landing-page">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="animated slideInLeft">
              Unleash Your Potential with <span className="brand">Code<span className="highlight">Arena</span></span>
            </h1>
            <p className="animated slideInRight">
              Master coding challenges, collaborate globally, and rank among the best developers.
            </p>
            <div className="cta-buttons animated bounceIn">
              <Link to="/problems" className="btn-primary">Start Solving</Link>
              <button onClick={handleJoinClick} className="btn-secondary">Join Now</button>
            </div>
          </div>
        </div>

        {/* Why Should You Join Us Section */}
        <div className="why-join-section animated fadeIn">
          <h2 className="section-title">Why Developers Thrive with CodeArena</h2>
          <div className="features-grid">
            <div className="feature-card animated slideInLeft">
              <div className="feature-icon">🚀</div>
              <div className="feature-content">
                <h3>Accelerate Your Growth</h3>
                <p>Dive into adaptive coding challenges that dynamically adjust to your skill level, ensuring continuous learning and improvement.</p>
              </div>
            </div>
            <div className="feature-card animated slideInUp">
              <div className="feature-icon">🌐</div>
              <div className="feature-content">
                <h3>Global Developer Network</h3>
                <p>Connect with passionate developers worldwide, engage in collaborative problem-solving, and expand your professional horizons.</p>
              </div>
            </div>
            <div className="feature-card animated slideInRight">
              <div className="feature-icon">🏆</div>
              <div className="feature-content">
                <h3>Career Advancement</h3>
                <p>Showcase your coding prowess, earn verifiable skills, and get direct visibility to top tech companies and recruiters.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="services-section animated fadeIn">
          <h2 className="section-title">Our Premier Services</h2>
          <div className="services-grid">
            <div className="service-card animated slideInLeft">
              <div className="service-icon">💻</div>
              <div className="service-content">
                <h3>Coding Challenges</h3>
                <p>Explore thousands of meticulously curated coding problems spanning multiple difficulty levels and technologies.</p>
              </div>
            </div>
            <div className="service-card animated slideInUp">
              <div className="service-icon">🤝</div>
              <div className="service-content">
                <h3>Collaborative Learning</h3>
                <p>Engage in pair programming, code reviews, and real-time problem-solving with developers from around the globe.</p>
              </div>
            </div>
            <div className="service-card animated slideInRight">
              <div className="service-icon">📊</div>
              <div className="service-content">
                <h3>Performance Analytics</h3>
                <p>Track your progress, analyze your coding patterns, and receive personalized insights to refine your skills.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section animated fadeIn">
          <h2 className="section-title">Success Stories</h2>
          <div className="testimonials-container">
            <div className="testimonial-card animated slideInLeft">
              <div className="testimonial-content">
                <p>"CodeArena transformed my coding journey. The challenging problems and supportive community helped me transition from a novice to a confident software engineer."</p>
                <div className="testimonial-author">
                  <img 
                    src={image1} 
                    alt="Jane Doe" 
                    className="testimonial-avatar" 
                  />
                  <div className="author-info">
                    <h4>Krishna Kumar</h4>
                    <span>Software Engineer, Google</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card animated slideInRight">
              <div className="testimonial-content">
                <p>"What sets CodeArena apart is its real-world problem-solving approach. I've not just learned coding, but developed a systematic approach to tackling complex challenges."</p>
                <div className="testimonial-author">
                  <img 
                    src={image2}
                    alt="John Smith" 
                    className="testimonial-avatar" 
                  />
                  <div className="author-info">
                    <h4>Sumit Kashyup </h4>
                    <span>Lead Developer, Startup X</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section animated fadeIn">
          <h2 className="section-title">Ready to Elevate Your Coding Skills?</h2>
          <p>Join thousands of developers transforming their careers with CodeArena.</p>
          <div className="contact-buttons animated bounceIn">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
            <a href="mailto:chauhankhushnam@gmail.com" className="btn-secondary">Email Support</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;
