import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <h3>About CodeArena</h3>
            <p>
              CodeArena is a global platform for coders to solve challenges, 
              compete on leaderboards, and build their coding skills.
            </p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/problems">Problems</a></li>
              <li><a href="/rankings">Rankings</a></li>
              <li><a href="/collab">Collab</a></li>
              <li><a href="/login">Login</a></li>
            </ul>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>Email: chauhankhushnam@gmail.com</p>
            <p>Phone: +91 862310732</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 CodeArena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
