import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import "./VideoPlayer.css";

const VideoPlayer = ({ 
  videoUrl, 
  title = "AI Lecture Video", 
  topic = "Learning Topic",
  autoPlay = false,
  onComplete = null 
}) => {
  const { language } = useContext(AppContext);
  
  // Video playback state
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes default
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // AI Features state
  const [showCaptions, setShowCaptions] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showScenes, setShowScenes] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [isLoadingAIFeatures, setIsLoadingAIFeatures] = useState(false);

  // Mock AI data
  const aiCaptions = [
    { time: 0, text: "Welcome to this AI-generated lecture on " + topic },
    { time: 30, text: "Let's explore the key concepts and principles" },
    { time: 60, text: "This is an important point to remember" },
    { time: 120, text: "Notice how these elements interact together" },
    { time: 180, text: "Let's summarize what we've learned so far" },
  ];

  const aiNotes = [
    "📌 Key Concept 1: Understanding the fundamentals",
    "📌 Key Concept 2: Practical application methods",
    "📌 Important: Remember to practice regularly",
    "💡 Tip: Try to connect this with previous knowledge",
    "✅ Summary: These principles form the foundation",
  ];

  const aiScenes = [
    { time: 0, title: "Introduction", description: "Overview of the topic" },
    { time: 60, title: "Core Concepts", description: "Fundamental principles explained" },
    { time: 120, title: "Practical Examples", description: "Real-world applications" },
    { time: 180, title: "Q&A Session", description: "Common questions answered" },
    { time: 240, title: "Summary", description: "Quick recap and key takeaways" },
  ];

  const getCurrentCaption = () => {
    return aiCaptions.find(cap => Math.abs(cap.time - Math.floor(currentTime)) < 5)?.text || "...";
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
  };

  const handleGenerateNotes = async () => {
    setIsLoadingAIFeatures(true);
    // Simulate AI API call
    setTimeout(() => {
      setIsLoadingAIFeatures(false);
      setShowNotes(!showNotes);
    }, 800);
  };

  const handleDownloadNotes = () => {
    const notesText = `AI-Generated Notes: ${title}\n\nTopic: ${topic}\n\n${aiNotes.join("\n")}\n\nGenerated on: ${new Date().toLocaleString()}`;
    const blob = new Blob([notesText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}-notes.txt`;
    a.click();
  };

  return (
    <div className={`ai-video-player ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="video-wrapper">
        {/* Main video section */}
        <div className="video-container">
          {/* Video Content Area */}
          <div className="video-placeholder">
            <div className="placeholder-content">
              <div className="play-icon">▶️</div>
              <p>{title}</p>
              <p className="placeholder-subtitle">🤖 AI-Generated Interactive Video</p>
            </div>

            {/* Live Captions */}
            {showCaptions && (
              <div className="live-captions">
                <p>{getCurrentCaption()}</p>
              </div>
            )}
          </div>

          {/* Progress Bar with Scene Markers */}
          <div className="progress-section">
            <div className="progress-bar">
              {/* Scene markers */}
              {aiScenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="scene-marker"
                  style={{ left: `${(scene.time / duration) * 100}%` }}
                  title={scene.title}
                >
                  {idx + 1}
                </div>
              ))}
              <div className="progress-fill" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                className="progress-slider"
              />
            </div>
          </div>

          {/* Player Controls */}
          <div className="video-controls">
            <div className="controls-bottom">
              <div className="controls-left">
                <button onClick={handlePlayPause} className="control-btn" title={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? "⏸️" : "▶️"}
                </button>

                <div className="volume-control">
                  <span className="volume-icon">🔊</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="volume-slider"
                  />
                </div>

                <span className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Playback Speed */}
                <div className="speed-control">
                  <div className="speed-menu">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button
                        key={rate}
                        className={`speed-option ${playbackRate === rate ? "active" : ""}`}
                        onClick={() => handlePlaybackRate(rate)}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                  <button className="control-btn" title={`Speed: ${playbackRate}x`}>
                    {playbackRate}x
                  </button>
                </div>
              </div>

              <div className="controls-right">
                {/* AI Features Toggle Buttons */}
                <button
                  className={`control-btn ai-btn ${showCaptions ? "active" : ""}`}
                  onClick={() => setShowCaptions(!showCaptions)}
                  title="AI Captions"
                >
                  📝
                </button>

                <button
                  className={`control-btn ai-btn ${showScenes ? "active" : ""}`}
                  onClick={() => setShowScenes(!showScenes)}
                  title="AI Scenes"
                >
                  🎬
                </button>

                <button
                  className={`control-btn ai-btn ${showNotes ? "active" : ""}`}
                  onClick={handleGenerateNotes}
                  disabled={isLoadingAIFeatures}
                  title="AI Notes"
                >
                  {isLoadingAIFeatures ? "⏳" : "📋"}
                </button>

                <button className="control-btn" title="Settings">
                  ⚙️
                </button>

                <button onClick={handleFullscreen} className="control-btn" title="Fullscreen">
                  {isFullscreen ? "⛶" : "⟳"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel with AI Features */}
        {!isFullscreen && (
          <div className="ai-features-panel">
            <div className="panel-tabs">
              <button
                className={`tab-btn ${activeTab === "video" ? "active" : ""}`}
                onClick={() => setActiveTab("video")}
              >
                Info
              </button>
              {showNotes && (
                <button
                  className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
                  onClick={() => setActiveTab("notes")}
                >
                  Notes
                </button>
              )}
              {showScenes && (
                <button
                  className={`tab-btn ${activeTab === "scenes" ? "active" : ""}`}
                  onClick={() => setActiveTab("scenes")}
                >
                  Scenes
                </button>
              )}
              {showCaptions && (
                <button
                  className={`tab-btn ${activeTab === "captions" ? "active" : ""}`}
                  onClick={() => setActiveTab("captions")}
                >
                  Captions
                </button>
              )}
            </div>

            <div className="panel-content">
              {/* Video Info Tab */}
              {activeTab === "video" && (
                <div className="panel-section">
                  <h4>📺 Video Information</h4>
                  <div className="info-item">
                    <span className="info-label">Title:</span>
                    <span>{title}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Topic:</span>
                    <span>{topic}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Duration:</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Language:</span>
                    <span>{language === "en" ? "English" : language === "te" ? "Telugu" : "Hindi"}</span>
                  </div>
                  <p className="panel-description">
                    This is an AI-generated interactive lecture with real-time transcription, scene detection, and smart learning features.
                  </p>
                </div>
              )}

              {/* AI Notes Tab */}
              {activeTab === "notes" && showNotes && (
                <div className="panel-section">
                  <div className="notes-header">
                    <h4>📋 AI-Generated Notes</h4>
                    <button className="download-btn" onClick={handleDownloadNotes} title="Download notes">
                      💾
                    </button>
                  </div>
                  <div className="notes-list">
                    {aiNotes.map((note, idx) => (
                      <div key={idx} className="note-item">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Scenes Tab */}
              {activeTab === "scenes" && showScenes && (
                <div className="panel-section">
                  <h4>🎬 Video Scenes</h4>
                  <div className="scenes-list">
                    {aiScenes.map((scene, idx) => (
                      <div
                        key={idx}
                        className={`scene-item ${Math.abs(currentTime - scene.time) < 5 ? "active" : ""}`}
                        onClick={() => setCurrentTime(scene.time)}
                      >
                        <div className="scene-time">{formatTime(scene.time)}</div>
                        <div className="scene-info">
                          <div className="scene-title">{idx + 1}. {scene.title}</div>
                          <div className="scene-desc">{scene.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Captions Tab */}
              {activeTab === "captions" && showCaptions && (
                <div className="panel-section">
                  <h4>📝 Live Captions</h4>
                  <div className="captions-list">
                    {aiCaptions.map((cap, idx) => (
                      <div
                        key={idx}
                        className={`caption-item ${Math.abs(currentTime - cap.time) < 5 ? "active" : ""}`}
                        onClick={() => setCurrentTime(cap.time)}
                      >
                        <span className="caption-time">[{formatTime(cap.time)}]</span>
                        <span className="caption-text">{cap.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
