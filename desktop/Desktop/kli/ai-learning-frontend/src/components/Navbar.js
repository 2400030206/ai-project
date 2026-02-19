import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import LanguageSelector from "./LanguageSelector";
import "./Navbar.css";

const Navbar = () => {
  const { learningMode, updateLearningMode, language, updateLanguage, examMode } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'en');
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    updateLanguage(langCode);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/dashboard" className="navbar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">AI Learning</span>
        </Link>

        {/* Navigation Links */}
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/exam" className="nav-link">
              Exam
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/review" className="nav-link">
              Review
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/videos" className="nav-link">
              📹 Videos
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/chat" className="nav-link chat-link">
              💬 Chat
            </Link>
          </li>
        </ul>

        {/* Controls */}
        {!examMode && (
          <div className="navbar-controls">
            {/* Learning Mode Selector */}
            <div className="control-group">
              <label htmlFor="learning-mode">Mode:</label>
              <select
                id="learning-mode"
                value={learningMode}
                onChange={(e) => updateLearningMode(e.target.value)}
                className="control-select"
              >
                <option value="simple">📚 Simple</option>
                <option value="exam">🎯 Exam</option>
                <option value="advanced">🧠 Advanced</option>
              </select>
            </div>

            {/* Language Selector Component */}
            <LanguageSelector 
              onLanguageChange={handleLanguageChange}
              currentLanguage={selectedLanguage}
            />

            {/* User Menu */}
            <div className="user-menu">
              <button 
                className="user-button" 
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">👤</span>
                <span className="user-name">{user.name || "User"}</span>
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="user-email">{user.email}</span>
                  </div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exam Mode Indicator */}
        {examMode && (
          <div className="exam-mode-indicator">
            <span className="pulse"></span>
            <span>Exam Mode Active</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
