import React, { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { generateLecture, generateRevisionNotes } from "../services/api";
import "./Whiteboard.css";

const Whiteboard = ({ topicName = "Current Topic" }) => {
  const [scenes, setScenes] = useState([]);
  const [currentScene, setCurrentScene] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [revisionMode, setRevisionMode] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const { extractedText, language } = useContext(AppContext);

  useEffect(() => {
    // Request digital pen support for enhanced drawing
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6366f1";
    }
  }, []);

  const handleLoadLecture = async () => {
    if (!extractedText) {
      setError("Please upload a PDF first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await generateLecture(extractedText);
      setScenes(response.content || []);
      setCurrentScene(0);
      setRevisionMode(false);
    } catch (err) {
      setError(err.message || "Failed to load lecture");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadRevision = async () => {
    if (!extractedText) {
      setError("Please upload a PDF first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await generateRevisionNotes(extractedText);
      // Convert sections to scenes format for whiteboard display
      const revisionScenes = response.sections ? response.sections.map(section => ({
        heading: section.heading,
        text: section.points.join(', '),
        type: 'text'
      })) : [];
      setScenes(revisionScenes);
      setCurrentScene(0);
      setRevisionMode(true);
    } catch (err) {
      setError(err.message || "Failed to load revision");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const saveDrawing = () => {
    if (canvasRef.current) {
      const image = canvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `whiteboard-${new Date().getTime()}.png`;
      link.click();
    }
  };

  if (scenes.length === 0) {
    return (
      <div className="whiteboard-container">
        <div className="whiteboard-header">
          <h3>🎓 AI Lecture & Whiteboard</h3>
          <p className="whiteboard-subtitle">
            {revisionMode ? "5-Minute Quick Revision" : "Scene-based Teaching Style"}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="lecture-options card">
          <div className="option-group">
            <button onClick={handleLoadLecture} disabled={isLoading} className="btn btn-primary btn-lg">
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span>📚</span>
                  Full Lecture
                </>
              )}
            </button>
            <p className="option-description">Complete whiteboard explanation with all scenes</p>
          </div>

          <div className="divider">OR</div>

          <div className="option-group">
            <button onClick={handleLoadRevision} disabled={isLoading} className="btn btn-secondary btn-lg">
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span>⏱️</span>
                  5-Min Revision
                </>
              )}
            </button>
            <p className="option-description">Quick 5-minute summary for fast learning</p>
          </div>
        </div>
      </div>
    );
  }

  const scene = scenes[currentScene];

  return (
    <div className="whiteboard-container">
      {/* Progress */}
      <div className="lecture-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          Scene {currentScene + 1} of {scenes.length} - {revisionMode ? "Revision" : "Lecture"}
        </p>
      </div>

      {/* Whiteboard Canvas */}
      <div className="whiteboard-main">
        <canvas
          ref={canvasRef}
          className="whiteboard-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Scene Content */}
      {scene && (
        <div className="scene-content card">
          <div className="scene-header">
            <h4>{scene.title}</h4>
          </div>
          <p className="scene-description">{scene.description}</p>
          {scene.keyPoints && (
            <ul className="key-points">
              {scene.keyPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="whiteboard-controls">
        <div className="drawing-tools">
          <button onClick={clearCanvas} className="btn btn-outline btn-sm" title="Clear canvas">
            🗑️ Clear
          </button>
          <button onClick={saveDrawing} className="btn btn-outline btn-sm" title="Save drawing">
            💾 Save
          </button>
        </div>

        <div className="navigation-buttons">
          <button
            onClick={() => setCurrentScene(Math.max(0, currentScene - 1))}
            disabled={currentScene === 0}
            className="btn btn-outline"
          >
            ← Previous
          </button>

          {currentScene === scenes.length - 1 ? (
            <button
              onClick={() => {
                setScenes([]);
                setCurrentScene(0);
              }}
              className="btn btn-primary"
            >
              Done ✓
            </button>
          ) : (
            <button
              onClick={() => setCurrentScene(Math.min(scenes.length - 1, currentScene + 1))}
              disabled={currentScene === scenes.length - 1}
              className="btn btn-primary"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
