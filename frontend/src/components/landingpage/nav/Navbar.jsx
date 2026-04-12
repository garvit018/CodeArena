import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/authContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle responsive design and menu closing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;

      // Close menu when switching to desktop
      if (!mobile) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
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
      <li className="mb-4 md:mb-0">
        <Link
          to="/"
          onClick={closeMenu}
          className="text-xl md:text-lg text-slate-100 hover:text-cyan-300 transition-colors duration-300 relative pb-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
        >
          Home
        </Link>
      </li>
      {isLoggedIn && (
        <>
          <li className="mb-4 md:mb-0">
            <Link
              to="/problemtable"
              onClick={closeMenu}
              className="text-xl md:text-lg text-slate-100 hover:text-cyan-300 transition-colors duration-300 relative pb-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Problems
            </Link>
          </li>
          <li className="mb-4 md:mb-0">
            <Link
              to="/rankings"
              onClick={closeMenu}
              className="text-xl md:text-lg text-slate-100 hover:text-cyan-300 transition-colors duration-300 relative pb-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Rankings
            </Link>
          </li>
          <li className="mb-4 md:mb-0">
            <Link
              to="/home"
              onClick={closeMenu}
              className="text-xl md:text-lg text-slate-100 hover:text-cyan-300 transition-colors duration-300 relative pb-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Collab
            </Link>
          </li>
          <li className="mb-4 md:mb-0">
            <Link
              to="/profile"
              onClick={closeMenu}
              className="text-xl md:text-lg text-slate-100 hover:text-cyan-300 transition-colors duration-300 relative pb-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
            >
              Profile
            </Link>
          </li>
          <li className="mb-4 md:mb-0">
            <button
              onClick={handleLogout}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-full px-4 py-2 transition-colors duration-300 text-xl md:text-lg"
            >
              Logout
            </button>
          </li>
        </>
      )}
      {!isLoggedIn && (
        <li className="mb-4 md:mb-0">
          <Link
            to="/login"
            onClick={closeMenu}
            className="text-xl md:text-lg text-slate-100 hover:text-cyan-300 transition-colors duration-300 relative pb-1 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
          >
            Login
          </Link>
        </li>
      )}
    </>
  );

  return (
    <nav className="bg-slate-950 py-4 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold text-slate-100 hover:text-cyan-300 transition-colors duration-300 ml-12"
          onClick={closeMenu}
        >
          CODE<span className="text-cyan-300">ARENA</span>
        </Link>

        {!isAuthPage && (
          <>
            {/* Hamburger icon */}
            <button
              className={`md:hidden flex flex-col justify-between w-8 h-6 bg-transparent border-none cursor-pointer z-20 relative mr-4 ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <span className="block h-1 w-full bg-white rounded transition-all duration-300"></span>
              <span className="block h-1 w-full bg-white rounded transition-all duration-300"></span>
              <span className="block h-1 w-full bg-white rounded transition-all duration-300"></span>
            </button>

            {/* Navigation links */}
            <ul
              className={`md:flex md:items-center md:gap-8 md:mr-12 md:static md:flex-row md:bg-transparent md:h-auto md:w-auto md:translate-x-0 md:opacity-100 md:justify-end md:p-0 fixed top-0 left-0 w-full h-screen bg-slate-950 bg-opacity-95 flex-col justify-center items-center z-10 transition-all duration-300 ease-in-out ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 md:opacity-100 md:translate-x-0"
              }`}
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
