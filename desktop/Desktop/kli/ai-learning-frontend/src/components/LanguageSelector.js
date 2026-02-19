import React, { useState, useEffect } from 'react';
import './LanguageSelector.css';

function LanguageSelector({ onLanguageChange, currentLanguage = 'en' }) {
  const [languages, setLanguages] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/localization/languages');
      const data = await response.json();
      setLanguages(data);
    } catch (err) {
      console.error('Error fetching languages:', err);
      setError('Failed to load languages');
    }
  };

  const handleLanguageChange = (langCode) => {
    onLanguageChange(langCode);
    localStorage.setItem('selectedLanguage', langCode);
    setIsOpen(false);
  };

  const currentLanguageName = languages[currentLanguage] || 'English';

  return (
    <div className="language-selector">
      <button 
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Select Language"
      >
        🌐 {currentLanguageName}
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="language-header">
            <h4>Select Language</h4>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="language-grid">
            {Object.entries(languages).map(([code, name]) => (
              <button
                key={code}
                className={`language-option ${currentLanguage === code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(code)}
              >
                <span className="lang-name">{name}</span>
                <span className="lang-code">({code.toUpperCase()})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
