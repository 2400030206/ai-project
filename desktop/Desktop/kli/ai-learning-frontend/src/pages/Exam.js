import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { startExam, submitExam } from "../services/api";
import { ExamModeManager, ExamTimer } from "../utils/ExamModeManager";
import Quiz from "../components/Quiz";
import "./Exam.css";

const Exam = () => {
  const {
    examMode,
    startExamSession,
    endExamSession,
    tabSwitchCount,
    incrementTabSwitch,
    extractedText,
  } = useContext(AppContext);

  const [examState, setExamState] = useState("ready"); // ready, running, submitted
  const [examDuration, setExamDuration] = useState(60); // minutes
  const [timeLeft, setTimeLeft] = useState("");
  const [examManager, setExamManager] = useState(null);
  const [timer, setTimer] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");
  const [examData, setExamData] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleExamStart = async () => {
    startExamSession();
    setExamState("running");

    // Initialize exam mode manager
    const manager = new ExamModeManager(() => {
      incrementTabSwitch();
      handleTabSwitch();
    }, handlePageLeave);

    manager.startMonitoring();
    setExamManager(manager);

    // Initialize exam timer
    const examTimer = new ExamTimer(examDuration);
    examTimer.start(
      (time) => setTimeLeft(time),
      handleExamTimeUp
    );
    setTimer(examTimer);

    // Start exam on backend
    try {
      const response = await startExam("exam-1");
      setExamData(response);
    } catch (err) {
      console.error("Failed to start exam:", err);
    }
  };

  const handleTabSwitch = () => {
    setWarningMessage("⚠️ Tab switching detected! This will affect your score.");
    setTimeout(() => setWarningMessage(""), 5000);
  };

  const handlePageLeave = () => {
    handleAutoSubmit("You left the exam page. Auto-submitting...");
  };

  const handleExamTimeUp = () => {
    handleAutoSubmit("Time's up! Auto-submitting your exam...");
  };

  const handleAutoSubmit = async (message) => {
    setWarningMessage(message);
    await handleExamSubmit();
  };

  const handleExamSubmit = async () => {
    if (timer) {
      timer.stop();
    }
    if (examManager) {
      examManager.stopMonitoring();
    }
    endExamSession();
    setExamState("submitted");

    try {
      const response = await submitExam("exam-1", answers);
      console.log("Exam results:", response);
    } catch (err) {
      console.error("Failed to submit exam:", err);
    }
  };

  const handleResetExam = () => {
    setExamState("ready");
    setWarningMessage("");
    setTimeLeft("");
    setExamData(null);
    setAnswers({});
    if (timer) {
      timer.stop();
    }
    if (examManager) {
      examManager.stopMonitoring();
    }
  };

  useEffect(() => {
    return () => {
      if (timer) {
        timer.stop();
      }
      if (examManager) {
        examManager.stopMonitoring();
      }
    };
  }, []);

  return (
    <div className="exam-container">
      <div className="exam-header">
        <h1>🎯 AI Learning Exam Mode</h1>
        <p>Secure testing environment with proctoring features</p>
      </div>

      {/* Warning Messages */}
      {warningMessage && (
        <div className={`alert ${warningMessage.includes("Tab") ? "alert-warning" : "alert-error"}`}>
          {warningMessage}
        </div>
      )}

      {/* Tab Switch Warning */}
      {tabSwitchCount > 0 && examMode && (
        <div className="tab-switch-alert alert alert-warning">
          ⚠️ Tab switches detected: {tabSwitchCount}
          {tabSwitchCount > 2 && " - Your exam will be auto-submitted if this continues!"}
        </div>
      )}

      {/* Ready State */}
      {examState === "ready" && (
        <div className="exam-ready card">
          <h2>📋 Exam Settings</h2>
          <p className="exam-description">
            This exam is in secure mode. You will not be able to switch tabs or open other windows.
          </p>

          <div className="exam-setup">
            <div className="setup-section">
              <h3>Security Features:</h3>
              <ul className="security-features">
                <li>✅ Tab switching detection</li>
                <li>✅ Window/page leave detection</li>
                <li>✅ Full-screen recommended</li>
                <li>✅ Auto-submit on violations</li>
                <li>✅ Keyboard shortcut blocking</li>
              </ul>
            </div>

            <div className="setup-section">
              <label htmlFor="exam-duration">
                <strong>Exam Duration (minutes):</strong>
              </label>
              <input
                id="exam-duration"
                type="number"
                min="5"
                max="180"
                value={examDuration}
                onChange={(e) => setExamDuration(parseInt(e.target.value))}
              />
            </div>

            <div className="exam-agreement">
              <label>
                <input type="checkbox" required />
                <span>
                  I understand the exam rules and agree to follow them. I will not switch tabs or leave the exam page.
                </span>
              </label>
            </div>

            <button
              onClick={handleExamStart}
              className="btn btn-primary btn-lg"
            >
              🚀 Start Exam
            </button>
          </div>
        </div>
      )}

      {/* Running State */}
      {examState === "running" && examMode && (
        <div className="exam-running">
          {/* Timer Bar */}
          <div className="exam-timer-bar">
            <div className="timer-display">
              <span className="timer-label">Time Remaining:</span>
              <span className={`timer-value ${parseInt(timeLeft) < 300 ? "critical" : ""}`}>
                {timeLeft}
              </span>
            </div>
            <div className="timer-progress">
              <div className="timer-fill"></div>
            </div>
          </div>

          {/* Exam Content */}
          <div className="exam-content">
            <Quiz
              content={extractedText || "General knowledge exam"}
              onQuizComplete={(results) => {
                setAnswers(results.answers);
                handleExamSubmit();
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="exam-submit-section">
            <button
              onClick={handleExamSubmit}
              className="btn btn-primary btn-lg"
            >
              ✓ Submit Exam
            </button>
            <p className="submit-warning">⚠️ You cannot change your answers after submission</p>
          </div>
        </div>
      )}

      {/* Submitted State */}
      {examState === "submitted" && (
        <div className="exam-submitted card">
          <div className="submitted-message">
            <div className="success-icon">✅</div>
            <h2>Exam Submitted Successfully!</h2>
            <p>Your exam has been recorded and will be graded by the AI system.</p>
            {tabSwitchCount > 0 && (
              <div className="alert alert-warning">
                ⚠️ You switched tabs {tabSwitchCount} time(s) during the exam. This may affect your score.
              </div>
            )}
          </div>

          <div className="exam-stats">
            <div className="stat-card">
              <div className="stat-label">Duration Used</div>
              <div className="stat-value">
                {examDuration - Math.floor(parseInt(timeLeft) / 60)}m
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Tab Switches</div>
              <div className="stat-value">{tabSwitchCount}</div>
            </div>
          </div>

          <button
            onClick={handleResetExam}
            className="btn btn-primary btn-lg"
          >
            🔄 Attempt Another Exam
          </button>
        </div>
      )}
    </div>
  );
};

export default Exam;
