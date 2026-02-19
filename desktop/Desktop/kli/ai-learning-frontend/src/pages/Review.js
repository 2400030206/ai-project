import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
// import { getExamReview } from "../services/api"; // TODO: Backend endpoint not yet implemented
import "./Review.css";

const Review = () => {
  const [examId, setExamId] = useState("exam-1");
  const [reviewData, setReviewData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const { language } = useContext(AppContext);

  const handleLoadReview = async () => {
    setIsLoading(true);
    setError("");

    try {
      // TODO: Backend endpoint not yet implemented
      // const response = await getExamReview(examId);
      // setReviewData(response);
      
      // Mock data for now
      setReviewData({
        examId: examId,
        questions: [
          {
            id: 1,
            question: "Sample question?",
            userAnswer: "Sample answer",
            correctAnswer: "Sample answer",
            isCorrect: true
          }
        ]
      });
    } catch (err) {
      setError(err.message || "Failed to load review");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    if (!reviewData || !reviewData.questions) return {};

    const correctCount = reviewData.questions.filter(
      (q) => q.userAnswer === q.correctAnswer
    ).length;
    const totalCount = reviewData.questions.length;
    const percentage = (correctCount / totalCount) * 100;

    return {
      correct: correctCount,
      total: totalCount,
      percentage: percentage.toFixed(1),
      performance:
        percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement",
      performanceColor:
        percentage >= 80 ? "#10b981" : percentage >= 60 ? "#3b82f6" : "#f59e0b",
    };
  };

  const stats = calculateStats();

  const handleExportPDF = () => {
    if (reviewData) {
      alert("PDF export feature coming soon!");
      // Can integrate with libraries like jsPDF or html2pdf
    }
  };

  if (!reviewData) {
    return (
      <div className="review-container">
        <div className="review-header">
          <h1>📋 Exam Review</h1>
          <p>Review your exam answers with detailed explanations</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="review-welcome card">
          <h2>Load Your Exam Review</h2>
          <p>Enter your exam ID to view detailed answers and explanations.</p>

          <div className="load-review-form">
            <input
              type="text"
              placeholder="Enter Exam ID (e.g., exam-1)"
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleLoadReview}
              disabled={isLoading || !examId}
              className="btn btn-primary btn-lg"
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                <>
                  <span>📂</span>
                  Load Review
                </>
              )}
            </button>
          </div>

          <div className="review-features">
            <h3>Review Features:</h3>
            <ul>
              <li>✅ See correct and incorrect answers</li>
              <li>✅ Detailed explanations for each question</li>
              <li>✅ Learn from mistakes</li>
              <li>✅ Track your progress</li>
              <li>✅ Export as PDF (coming soon)</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="review-container">
      <div className="review-header">
        <h1>📊 Your Exam Review</h1>
        <p>Learn from your answers and improve</p>
      </div>

      {/* Score Summary */}
      <div className="score-summary card">
        <div className="score-circle">
          <div className="score-percentage" style={{ color: stats.performanceColor }}>
            {stats.percentage}%
          </div>
          <div className="score-label">Score</div>
        </div>

        <div className="score-details">
          <div className="score-detail-item">
            <span className="score-detail-label">Performance:</span>
            <span
              className="score-detail-value"
              style={{ color: stats.performanceColor }}
            >
              {stats.performance}
            </span>
          </div>
          <div className="score-detail-item">
            <span className="score-detail-label">Correct Answers:</span>
            <span className="score-detail-value">
              {stats.correct} / {stats.total}
            </span>
          </div>
          <div className="score-detail-item">
            <span className="score-detail-label">Accuracy Rate:</span>
            <span className="score-detail-value">{stats.percentage}%</span>
          </div>
        </div>

        <div className="score-actions">
          <button onClick={handleExportPDF} className="btn btn-outline">
            📥 Export as PDF
          </button>
          <button onClick={() => setReviewData(null)} className="btn btn-primary">
            🔄 Load Another
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="review-filters">
        <button className="filter-btn active">All Questions</button>
        <button className="filter-btn">
          ✅ Correct ({reviewData.questions.filter((q) => q.userAnswer === q.correctAnswer).length})
        </button>
        <button className="filter-btn">
          ❌ Incorrect ({reviewData.questions.filter((q) => q.userAnswer !== q.correctAnswer).length})
        </button>
      </div>

      {/* Questions Review */}
      <div className="questions-review">
        {reviewData.questions.map((question, idx) => {
          const isCorrect = question.userAnswer === question.correctAnswer;
          const isExpanded = expandedQuestion === idx;

          return (
            <div
              key={idx}
              className={`review-question-card ${isCorrect ? "correct" : "incorrect"}`}
            >
              <div className="question-header">
                <div className="question-number-icon">
                  <span className={`icon ${isCorrect ? "correct-icon" : "incorrect-icon"}`}>
                    {isCorrect ? "✅" : "❌"}
                  </span>
                  <span className="question-number">Q{idx + 1}</span>
                </div>

                <div className="question-title">{question.question}</div>

                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                  className="expand-btn"
                >
                  {isExpanded ? "▲" : "▼"}
                </button>
              </div>

              {isExpanded && (
                <div className="question-content">
                  <div className="answer-section">
                    <h4>Your Answer:</h4>
                    <div className={`answer-box user-answer ${isCorrect ? "correct" : "incorrect"}`}>
                      {question.userAnswer || "(No answer provided)"}
                    </div>
                  </div>

                  {!isCorrect && (
                    <div className="answer-section">
                      <h4>Correct Answer:</h4>
                      <div className="answer-box correct-answer">
                        {question.correctAnswer}
                      </div>
                    </div>
                  )}

                  {question.explanation && (
                    <div className="answer-section">
                      <h4>📚 Explanation:</h4>
                      <div className="explanation-box">
                        <p>{question.explanation}</p>
                      </div>
                    </div>
                  )}

                  {question.topicsToCover && question.topicsToCover.length > 0 && (
                    <div className="answer-section">
                      <h4>📖 Topics to Review:</h4>
                      <ul className="topics-list">
                        {question.topicsToCover.map((topic, topicIdx) => (
                          <li key={topicIdx}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="review-actions">
        <button onClick={() => setReviewData(null)} className="btn btn-primary btn-lg">
          🔄 Load Another Exam
        </button>
      </div>

      {/* Learning Recommendations */}
      {stats.percentage < 80 && (
        <div className="learning-recommendations card">
          <h3>🎯 Recommended Learning Path</h3>
          <p>Based on your performance, here are recommended topics to focus on:</p>
          <ul className="recommendations-list">
            <li>📚 Review weak areas from incorrect questions</li>
            <li>🎓 Take additional quizzes on challenging topics</li>
            <li>💡 Use Simple Mode explanations for better understanding</li>
            <li>🔊 Listen to voice explanations with adjustable speed</li>
            <li>✏️ Practice with similar MCQ questions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Review;
