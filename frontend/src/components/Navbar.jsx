import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";
import logo from "../assets/LOGO1.png"; // Import logo

// const Navbar = ({ theme, toggleTheme }) => {
//   const location = useLocation()
//   const navigate = useNavigate()
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [userName, setUserName] = useState('')
//   const [showDropdown, setShowDropdown] = useState(false)
//   const dropdownRef = useRef(null)

//   useEffect(() => {
//     // Check authentication status
//     const authStatus = localStorage.getItem('isAuthenticated')
//     const name = localStorage.getItem('userName') || localStorage.getItem('userEmail')
//     setIsAuthenticated(authStatus === 'true')
//     setUserName(name || '')
//   }, [location])

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setShowDropdown(false)
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside)
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside)
//     }
//   }, [])

//   const handleLogout = () => {
//     localStorage.removeItem('isAuthenticated')
//     localStorage.removeItem('userEmail')
//     localStorage.removeItem('userName')
//     setIsAuthenticated(false)
//     setUserName('')
//     setShowDropdown(false)
//     navigate('/')
//   }

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";
import logo from "../assets/LOGO1.png"; // Import logo

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* --- LOGO + TITLE SECTION --- */}
        <Link to="/" className="navbar-logo">
          <motion.img
            src={logo}
            alt="AyurVerse Logo"
            className="logo-image"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="logo-text-container">
            <span className="logo-text">आयुVerse</span>
            <span className="logo-subtitle">The Universe of Ayurveda</span>
          </div>
        </Link>

        {/* --- MENU LINKS --- */}
        <ul className="navbar-menu">
          <li>
            <Link
              to="/"
              className={`navbar-link ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/explore-plants"
              className={`navbar-link ${
                isActive("/explore-plants") ? "active" : ""
              }`}
            >
              Explore Plants
            </Link>
          </li>
          <li>
            <Link
              to="/herbal-chatbot"
              className={`navbar-link ${
                isActive("/herbal-chatbot") ? "active" : ""
              }`}
            >
              Herbal Chatbot
            </Link>
          </li>
          <li>
            <Link
              to="/3d-visualizer"
              className={`navbar-link ${
                isActive("/3d-visualizer") ? "active" : ""
              }`}
              to="/3D Visualizer"
              className={`navbar-link ${
                isActive("/3D Visualizer") ? "active" : ""
              }`}
            >
              Diet Chart
            </Link>
          </li>
          <li>
            <Link
              to="/virtual-tour"
              className={`navbar-link ${
                isActive("/virtual-tour") ? "active" : ""
              }`}
            >
              Virtual Tour
            </Link>
          </li>
        </ul>

        {/* --- THEME + PROFILE BUTTONS --- */}
        <div className="navbar-controls">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <div className="profile-container" ref={dropdownRef}>
            <button
              className="profile-icon"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Profile"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  className="profile-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="dropdown-header">
                        <div className="user-info">
                          <div className="user-avatar">
                            {userName ? userName.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="user-details">
                            <div className="user-name">
                              {userName || "User"}
                            </div>
                            <div className="user-email">
                              {localStorage.getItem("userEmail") || ""}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="3"></circle>
                          <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3"></path>
                        </svg>
                        <span>Settings</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item logout"
                        onClick={handleLogout}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                          <polyline points="10 17 15 12 10 7"></polyline>
                          <line x1="15" y1="12" x2="3" y2="12"></line>
                        </svg>
                        <span>Sign In</span>
                      </Link>
                      <Link
                        to="/register"
                        className="dropdown-item"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <line x1="20" y1="8" x2="20" y2="14"></line>
                          <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                        <span>Sign Up</span>
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
