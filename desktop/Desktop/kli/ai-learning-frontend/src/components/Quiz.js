import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { generateQuiz, generateAIQuiz, submitQuizAnswers } from "../services/api";
import "./Quiz.css";

const Quiz = ({ content, onQuizComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [quizType, setQuizType] = useState("mcq");
  const [questionCount, setQuestionCount] = useState(5);

  const { learningMode, language } = useContext(AppContext);

  const handleGenerateQuiz = async () => {
    if (!content) {
      setError("Please upload a PDF first");
      return;
    }

    setIsLoading(true);
    setError("");
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);

    try {
      const response = await generateAIQuiz(content, quizType, questionCount);
      setQuestions(response.questions || []);
    } catch (err) {
      setError(err.message || "Failed to generate AI quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = async () => {
    const allAnswered = questions.every((q) => answers[q.id]);
    if (!allAnswered) {
      setError("Please answer all questions before submitting");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await submitQuizAnswers("quiz-1", answers);
      setResults(response);
      setSubmitted(true);

      if (onQuizComplete) {
        onQuizComplete(response);
      }
    } catch (err) {
      setError(err.message || "Failed to submit quiz");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setResults(null);
  };

  if (questions.length === 0 && !submitted) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h3>📝 Smart Quiz</h3>
          <p className="quiz-subtitle">Test your understanding with AI-generated questions</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="quiz-setup card">
          <div className="setup-group">
            <label htmlFor="quiz-type">
              <strong>Question Type:</strong>
            </label>
            <select
              id="quiz-type"
              value={quizType}
              onChange={(e) => setQuizType(e.target.value)}
              disabled={isLoading}
            >
              <option value="mcq">Multiple Choice Questions (MCQ)</option>
              <option value="true-false">True/False</option>
              <option value="one-line">One-Line Answer</option>
            </select>
          </div>

          <div className="setup-group">
            <label htmlFor="question-count">
              <strong>Number of Questions:</strong>
            </label>
            <input
              id="question-count"
              type="number"
              min="1"
              max="20"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleGenerateQuiz}
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
                Generate Quiz
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    const score = results.scorePercentage || 0;
    const correctAnswers = results.correctCount || 0;
    const totalQuestions = results.totalCount || questions.length;

    return (
      <div className="quiz-container">
        <div className="quiz-results card">
          <div className="results-header">
            <h3>🎉 Quiz Complete!</h3>
          </div>

          <div className="results-score">
            <div className="score-circle">
              <div className="score-percentage">{score.toFixed(1)}%</div>
              <div className="score-text">Score</div>
            </div>
            <div className="score-details">
              <p>
                <strong>Correct Answers:</strong> {correctAnswers} / {totalQuestions}
              </p>
              <p>
                <strong>Performance:</strong>{" "}
                {score >= 80 ? (
                  <span className="badge badge-success">Excellent!</span>
                ) : score >= 60 ? (
                  <span className="badge badge-primary">Good</span>
                ) : (
                  <span className="badge badge-warning">Need Improvement</span>
                )}
              </p>
            </div>
          </div>

          <div className="results-breakdown">
            <h4>Answers Review:</h4>
            {questions.map((question, idx) => {
              const answeredCorrectly =
                answers[question.id] === question.correctAnswer;
              return (
                <div
                  key={question.id}
                  className={`review-item ${answeredCorrectly ? "correct" : "incorrect"}`}
                >
                  <div className="review-question">
                    <span className={`review-icon ${answeredCorrectly ? "" : ""}`}>
                      {answeredCorrectly ? "✅" : "❌"}
                    </span>
                    <span>Q{idx + 1}: {question.question}</span>
                  </div>
                  <div className="review-answers">
                    <p>
                      <strong>Your answer:</strong> {answers[question.id]}
                    </p>
                    {!answeredCorrectly && (
                      <p>
                        <strong>Correct answer:</strong> {question.correctAnswer}
                      </p>
                    )}
                    {question.explanation && (
                      <p className="review-explanation">
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleResetQuiz}
            className="btn btn-primary"
          >
            <span>🔄</span>
            Try Another Quiz
          </button>
        </div>
      </div>
    );
  }

  if (questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const isAnswered = answers[currentQuestion.id] !== undefined;

    return (
      <div className="quiz-container">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="question-card card">
          <div className="question-header">
            <h4>{currentQuestion.question}</h4>
          </div>

          <div className="question-options">
            {currentQuestion.type === "mcq" && (
              <div className="options-list">
                {currentQuestion.options?.map((option, idx) => (
                  <label key={idx} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "true-false" && (
              <div className="options-list">
                {["True", "False"].map((option) => (
                  <label key={option} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === "one-line" && (
              <input
                type="text"
                placeholder="Enter your answer..."
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="answer-input"
              />
            )}
          </div>
        </div>

        <div className="question-actions">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="btn btn-outline"
          >
            ← Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={!isAnswered || isLoading}
              className="btn btn-success"
            >
              {isLoading ? "Submitting..." : "Submit Quiz ✓"}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={!isAnswered}
              className="btn btn-primary"
            >
              Next →
            </button>
          )}
        </div>

        <div className="answer-indicator">
          <span className={isAnswered ? "answered" : "unanswered"}>
            {isAnswered ? "✓ Answered" : "○ Not Answered"}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default Quiz;
