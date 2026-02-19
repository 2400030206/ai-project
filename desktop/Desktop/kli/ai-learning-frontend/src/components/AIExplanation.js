import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { voiceSynthesis } from "../utils/VoiceSynthesis";
import "./AIExplanation.css";

const AIExplanation = () => {
  const { aiExplanation, isLoadingAI, language } = useContext(AppContext);
  const [isReading, setIsReading] = useState(false);
  const [readingRate, setReadingRate] = useState(1);

  const handleSpeak = () => {
    if (!aiExplanation) return;

    if (isReading) {
      voiceSynthesis.stop();
      setIsReading(false);
    } else {
      voiceSynthesis.speak(aiExplanation, language, readingRate);
      setIsReading(true);
    }
  };

  const handleCopy = () => {
    if (aiExplanation) {
      navigator.clipboard.writeText(aiExplanation);
      alert("Explanation copied to clipboard!");
    }
  };

  if (!aiExplanation && !isLoadingAI) {
    return (
      <div className="ai-explanation-placeholder">
        <div className="placeholder-icon">🤖</div>
        <p>Upload a PDF to get AI-powered explanations</p>
      </div>
    );
  }

  return (
    <div className="ai-explanation-container">
      <div className="explanation-header">
        <h3>🤖 AI Explanation</h3>
        <div className="explanation-controls">
          {aiExplanation && (
            <>
              <button
                onClick={handleSpeak}
                className={`btn btn-sm ${isReading ? "btn-danger" : "btn-primary"}`}
                title={isReading ? "Stop reading" : "Read aloud"}
              >
                {isReading ? "⏹️ Stop" : "🔊 Speak"}
              </button>
              <button
                onClick={handleCopy}
                className="btn btn-sm btn-outline"
                title="Copy text"
              >
                📋 Copy
              </button>
            </>
          )}
        </div>
      </div>

      {/* Reading Rate Control */}
      {aiExplanation && (
        <div className="reading-controls">
          <label htmlFor="reading-rate">Reading Speed:</label>
          <input
            id="reading-rate"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={readingRate}
            onChange={(e) => setReadingRate(parseFloat(e.target.value))}
            className="rate-slider"
          />
          <span className="rate-value">{readingRate.toFixed(1)}x</span>
        </div>
      )}

      {/* Loading State */}
      {isLoadingAI && !aiExplanation && (
        <div className="explanation-loading">
          <span className="spinner"></span>
          <p>Generating AI explanation...</p>
        </div>
      )}

      {/* Explanation Text */}
      {aiExplanation && (
        <div className="explanation-content">
          <p>{aiExplanation}</p>
        </div>
      )}

      {/* Helpful Tips */}
      {aiExplanation && (
        <div className="explanation-tips">
          <p>💡 <strong>Tip:</strong> Use the speak button to hear the explanation, adjust speed as needed.</p>
        </div>
      )}
    </div>
  );
};

export default AIExplanation;
