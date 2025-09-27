import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle responsive design and menu closing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Close menu when switching to desktop
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    // Close menu when route changes
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname]);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isLoggedIn = user || localStorage.getItem("token");

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Render nav links with common click handler
  const renderNavLinks = () => (
    <>
      <li>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
      </li>
      {isLoggedIn && (
        <>
          <li>
            <Link to="/problemtable" onClick={closeMenu}>
              Problems
            </Link>
          </li>
          <li>
            <Link to="/rankings" onClick={closeMenu}>
              Rankings
            </Link>
          </li>
          <li>
            <Link to="/home" onClick={closeMenu}>
              Collab
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={closeMenu}>
              Profile
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn nav-btn">
              Logout
            </button>
          </li>
        </>
      )}
      {!isLoggedIn && (
        <li>
          <Link to="/login" onClick={closeMenu}>
            Login
          </Link>
        </li>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Code<span className="highlight">Arena</span>
        </Link>

        {!isAuthPage && (
          <>
            {/* Hamburger icon */}
            <button
              className={`hamburger ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>

            {/* Navigation links */}
            <ul 
              className={`nav-links ${isMenuOpen ? "open" : ""}`}
              aria-hidden={!isMenuOpen}
            >
              {renderNavLinks()}
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;