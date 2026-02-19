import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { generateSmartSummary } from "../services/api";
import { voiceSynthesis } from "../utils/VoiceSynthesis";
import "./SmartSummary.css";

const SmartSummary = ({ content }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaryType, setSummaryType] = useState("concise");
  const [isReading, setIsReading] = useState(false);

  const { language } = useContext(AppContext);

  const handleGenerateSummary = async () => {
    if (!content) {
      setError("Please upload a PDF first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSummary(null);

    try {
      const response = await generateSmartSummary(content, summaryType, language);
      setSummary(response);
    } catch (err) {
      setError(err.message || "Failed to generate summary");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (!summary) return;

    const textToSpeak = `
      ${summary.title}. 
      ${summary.overview}. 
      Key Points: ${summary.keyPoints.join(". ")}. 
      ${summary.conclusion}
    `;

    if (isReading) {
      voiceSynthesis.stop();
      setIsReading(false);
    } else {
      voiceSynthesis.speak(textToSpeak, language, 1);
      setIsReading(true);
    }
  };

  const handleCopy = () => {
    if (!summary) return;

    const copyText = `
🎯 ${summary.title}

📝 Overview:
${summary.overview}

🔑 Key Points:
${summary.keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join("\n")}

✅ Conclusion:
${summary.conclusion}

📊 Summary Stats:
- Type: ${summaryType}
- Word Count: ${summary.wordCount || "N/A"}
- Estimated Reading Time: ${summary.readingTime || "N/A"} min
    `.trim();

    navigator.clipboard.writeText(copyText);
    alert("Summary copied to clipboard!");
  };

  const handleDownload = () => {
    if (!summary) return;

    const downloadText = `
Smart Summary
==============

Title: ${summary.title}

Overview:
${summary.overview}

Key Points:
${summary.keyPoints.map((point, idx) => `${idx + 1}. ${point}`).join("\n")}

Conclusion:
${summary.conclusion}

---
Generated on: ${new Date().toLocaleString()}
Summary Type: ${summaryType}
Language: ${language}
    `.trim();

    const blob = new Blob([downloadText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smart-summary-${Date.now()}.txt`;
    a.click();
  };

  if (!summary) {
    return (
      <div className="smart-summary-container">
        <div className="summary-header">
          <h3>🎯 Smart Summary</h3>
          <p className="summary-subtitle">
            Get AI-powered intelligent summaries of your content
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="summary-setup card">
          <div className="setup-group">
            <label htmlFor="summary-type">
              <strong>Summary Type:</strong>
            </label>
            <select
              id="summary-type"
              value={summaryType}
              onChange={(e) => setSummaryType(e.target.value)}
              disabled={isLoading}
            >
              <option value="concise">Concise - Quick overview</option>
              <option value="detailed">Detailed - In-depth analysis</option>
              <option value="bullet">Bullet Points - Key highlights</option>
              <option value="study">Study Guide - For exam prep</option>
            </select>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={isLoading || !content}
            className="btn btn-primary btn-lg"
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span>✨</span>
                Generate Smart Summary
              </>
            )}
          </button>

          <div className="summary-features">
            <h4>Smart Summary Features:</h4>
            <ul>
              <li>🎯 AI-powered key extraction</li>
              <li>📊 Multiple summary formats</li>
              <li>🔊 Listen to summaries</li>
              <li>💾 Download for later review</li>
              <li>📈 Estimated reading time</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-summary-container">
      <div className="summary-header">
        <h3>🎯 Smart Summary</h3>
        <div className="summary-actions">
          <button
            onClick={handleSpeak}
            className={`btn btn-sm ${isReading ? "btn-danger" : "btn-outline"}`}
            title={isReading ? "Stop reading" : "Read aloud"}
          >
            {isReading ? "⏹️ Stop" : "🔊 Speak"}
          </button>
          <button onClick={handleCopy} className="btn btn-sm btn-outline" title="Copy">
            📋 Copy
          </button>
          <button onClick={handleDownload} className="btn btn-sm btn-outline" title="Download">
            💾 Download
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats card">
        <div className="stat-item">
          <span className="stat-icon">📄</span>
          <span className="stat-label">Type</span>
          <span className="stat-value">{summaryType}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">📝</span>
          <span className="stat-label">Words</span>
          <span className="stat-value">{summary.wordCount || "N/A"}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">⏱️</span>
          <span className="stat-label">Read Time</span>
          <span className="stat-value">{summary.readingTime || "5"} min</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🔑</span>
          <span className="stat-label">Key Points</span>
          <span className="stat-value">{summary.keyPoints?.length || 0}</span>
        </div>
      </div>

      {/* Summary Content */}
      <div className="summary-content card">
        <div className="summary-title">
          <h2>{summary.title}</h2>
        </div>

        <div className="summary-section">
          <h4>📝 Overview</h4>
          <p className="summary-overview">{summary.overview}</p>
        </div>

        <div className="summary-section">
          <h4>🔑 Key Points</h4>
          <ul className="key-points-list">
            {summary.keyPoints.map((point, idx) => (
              <li key={idx} className="key-point-item">
                <span className="point-number">{idx + 1}</span>
                <span className="point-text">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {summary.topics && summary.topics.length > 0 && (
          <div className="summary-section">
            <h4>📚 Main Topics</h4>
            <div className="topics-grid">
              {summary.topics.map((topic, idx) => (
                <div key={idx} className="topic-tag">
                  {topic}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="summary-section">
          <h4>✅ Conclusion</h4>
          <p className="summary-conclusion">{summary.conclusion}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="summary-footer">
        <button
          onClick={() => {
            setSummary(null);
            setIsReading(false);
            voiceSynthesis.stop();
          }}
          className="btn btn-primary"
        >
          Generate New Summary
        </button>
      </div>
    </div>
  );
};

export default SmartSummary;
