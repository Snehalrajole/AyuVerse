import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'
import logo from '../assets/LOGO1.png'   // Import logo

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

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
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div className="logo-text-container">
            <span className="logo-text">आयुVerse</span>
            <span className="logo-subtitle">The Universe of Ayurveda</span>
          </div>
        </Link>

        {/* --- MENU LINKS --- */}
        <ul className="navbar-menu">
          <li>
            <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/explore-plants"
              className={`navbar-link ${isActive('/explore-plants') ? 'active' : ''}`}
            >
              Explore Plants
            </Link>
          </li>
          <li>
            <Link
              to="/herbal-chatbot"
              className={`navbar-link ${isActive('/herbal-chatbot') ? 'active' : ''}`}
            >
              Herbal Chatbot
            </Link>
          </li>
          <li>
            <Link
              to="/3D Visualizer"
              className={`navbar-link ${isActive('/3D Visualizer') ? 'active' : ''}`}
            >
              3D Visualizer
            </Link>
          </li>
          <li>
            <Link
              to="/virtual-tour"
              className={`navbar-link ${isActive('/virtual-tour') ? 'active' : ''}`}
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
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <button className="profile-icon" aria-label="Profile">
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
        </div>
      </div>
    </nav>
  )
}

export default Navbar
