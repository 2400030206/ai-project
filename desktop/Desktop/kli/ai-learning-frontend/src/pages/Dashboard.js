import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import Uploadpdf from "../components/Uploadpdf";
import AIExplanation from "../components/AIExplanation";
import Quiz from "../components/Quiz";
import Whiteboard from "../components/Whiteboard";
import VideoPlayer from "../components/VideoPlayer";
import Flashcards from "../components/Flashcards";
import SmartSummary from "../components/SmartSummary";
import ExamQuestions from "../components/ExamQuestions";
import "./Dashboard.css";

const Dashboard = () => {
  const { extractedText } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState("upload");

  const tabs = [
    { id: "upload", label: "📄 Upload", icon: "📁" },
    { id: "summary", label: "🎯 Summary", icon: "📋" },
    { id: "explain", label: "🤖 Explain", icon: "💡" },
    { id: "video", label: "🎥 AI Video", icon: "🎬" },
    { id: "quiz", label: "📝 Quiz", icon: "✏️" },
    { id: "questions", label: "📚 Exam Qs", icon: "❓" },
    { id: "flashcards", label: "🎴 Flashcards", icon: "🃏" },
    { id: "learn", label: "📚 Learn", icon: "🎓" },
  ];



  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>🚀 AI Learning Platform</h1>
        <p>Master any subject with AI-powered explanations and interactive learning</p>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              title={tab.label}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="dashboard-content">
        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="tab-content">
            <Uploadpdf />
          </div>
        )}

        {/* Smart Summary Tab */}
        {activeTab === "summary" && (
          <div className="tab-content">
            {extractedText ? (
              <SmartSummary content={extractedText} />
            ) : (
              <div className="placeholder-message">
                <p>📄 Please upload a PDF first to generate smart summaries</p>
              </div>
            )}
          </div>
        )}

        {/* Explain Tab */}
        {activeTab === "explain" && (
          <div className="tab-content">
            {extractedText ? (
              <AIExplanation />
            ) : (
              <div className="placeholder-message">
                <p>📄 Please upload a PDF first to see AI explanations</p>
              </div>
            )}
          </div>
        )}

        {/* AI Video Tab */}
        {activeTab === "video" && (
          <div className="tab-content">
            {extractedText ? (
              <VideoPlayer 
                title="AI-Generated Lecture"
                topic={extractedText.substring(0, 100) + "..."}
                autoPlay={false}
              />
            ) : (
              <div className="placeholder-message">
                <p>📄 Please upload a PDF first to generate AI videos</p>
              </div>
            )}
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === "quiz" && (
          <div className="tab-content">
            <Quiz content={extractedText} />
          </div>
        )}

        {/* Important Exam Questions Tab */}
        {activeTab === "questions" && (
          <div className="tab-content">
            {extractedText ? (
              <ExamQuestions content={extractedText} />
            ) : (
              <div className="placeholder-message">
                <p>📄 Please upload a PDF first to generate exam questions</p>
              </div>
            )}
          </div>
        )}

        {/* Flashcards Tab */}
        {activeTab === "flashcards" && (
          <div className="tab-content">
            {extractedText ? (
              <Flashcards content={extractedText} />
            ) : (
              <div className="placeholder-message">
                <p>📄 Please upload a PDF first to generate flashcards</p>
              </div>
            )}
          </div>
        )}

        {/* Learn Tab */}
        {activeTab === "learn" && (
          <div className="tab-content">
            {extractedText ? (
              <Whiteboard />
            ) : (
              <div className="placeholder-message">
                <p>📄 Please upload a PDF first to access the learning mode</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="dashboard-features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Smart Summary</h3>
            <p>AI-powered intelligent summaries in multiple formats</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Exam Questions</h3>
            <p>Important questions predicted by AI for exam prep</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>MCQ Quiz</h3>
            <p>Interactive quizzes with instant feedback</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✍️</div>
            <h3>One-Line Answers</h3>
            <p>Quick answer questions for rapid learning</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎴</div>
            <h3>Flashcards</h3>
            <p>Digital flashcards for effective memorization</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h3>Revision Notes</h3>
            <p>5-minute quick revision summaries</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔊</div>
            <h3>Voice Explanation</h3>
            <p>Listen to explanations with adjustable speed</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎥</div>
            <h3>AI Teaching Video</h3>
            <p>Auto-generated interactive lecture videos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Multi-Language</h3>
            <p>Learn in English, Telugu, or Hindi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
