import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { generateExamQuestions } from "../services/api";
import "./ExamQuestions.css";

const ExamQuestions = ({ content }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState(10);
  const [category, setCategory] = useState("all");

  const { language } = useContext(AppContext);

  const handleGenerateQuestions = async () => {
    if (!content) {
      setError("Please upload a PDF first");
      return;
    }

    setIsLoading(true);
    setError("");
    setQuestions([]);

    try {
      const response = await generateExamQuestions(
        content,
        difficulty,
        count,
        category,
        language
      );
      setQuestions(response.questions || []);
    } catch (err) {
      setError(err.message || "Failed to generate exam questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (questions.length === 0) return;

    const questionsText = questions
      .map(
        (q, idx) =>
          `${idx + 1}. ${q.question}\n   Category: ${q.category}\n   Difficulty: ${q.difficulty}\n   Answer: ${q.answer}\n`
      )
      .join("\n");

    const copyText = `
Important Exam Questions
========================

${questionsText}

Generated on: ${new Date().toLocaleString()}
Difficulty Level: ${difficulty}
Category: ${category}
Language: ${language}
    `.trim();

    navigator.clipboard.writeText(copyText);
    alert("Questions copied to clipboard!");
  };

  const handleDownload = () => {
    if (questions.length === 0) return;

    const questionsText = questions
      .map(
        (q, idx) =>
          `${idx + 1}. ${q.question}\n   Category: ${q.category}\n   Difficulty: ${q.difficulty}\n   Marks: ${q.marks || "N/A"}\n   Answer: ${q.answer}\n   Explanation: ${q.explanation || "N/A"}\n`
      )
      .join("\n");

    const downloadText = `
Important Exam Questions
========================

${questionsText}

---
Generated on: ${new Date().toLocaleString()}
Difficulty Level: ${difficulty}
Total Questions: ${questions.length}
Category: ${category}
Language: ${language}
    `.trim();

    const blob = new Blob([downloadText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam-questions-${Date.now()}.txt`;
    a.click();
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "easy":
        return "#10b981";
      case "medium":
        return "#f59e0b";
      case "hard":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (questions.length === 0) {
    return (
      <div className="exam-questions-container">
        <div className="questions-header">
          <h3>📝 Important Exam Questions</h3>
          <p className="questions-subtitle">
            Generate AI-curated questions most likely to appear in exams
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="questions-setup card">
          <div className="setup-grid">
            <div className="setup-group">
              <label htmlFor="difficulty">
                <strong>Difficulty Level:</strong>
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={isLoading}
              >
                <option value="easy">Easy - Basic concepts</option>
                <option value="medium">Medium - Standard exam level</option>
                <option value="hard">Hard - Advanced topics</option>
                <option value="mixed">Mixed - All levels</option>
              </select>
            </div>

            <div className="setup-group">
              <label htmlFor="category">
                <strong>Question Category:</strong>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isLoading}
              >
                <option value="all">All Topics</option>
                <option value="theory">Theory & Concepts</option>
                <option value="application">Application Based</option>
                <option value="numerical">Numerical Problems</option>
                <option value="short">Short Answer</option>
                <option value="long">Long Answer</option>
              </select>
            </div>

            <div className="setup-group">
              <label htmlFor="count">
                <strong>Number of Questions:</strong>
              </label>
              <input
                id="count"
                type="number"
                min="5"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateQuestions}
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
                Generate Exam Questions
              </>
            )}
          </button>

          <div className="questions-features">
            <h4>Why These Questions Matter:</h4>
            <ul>
              <li>🎯 AI predicts high-probability exam questions</li>
              <li>📚 Covers all important topics systematically</li>
              <li>💡 Includes detailed answers and explanations</li>
              <li>🏆 Based on previous year patterns</li>
              <li>⏱️ Marks allocation for time management</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);
  const difficultyBreakdown = questions.reduce((acc, q) => {
    acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="exam-questions-container">
      <div className="questions-header">
        <h3>📝 Important Exam Questions</h3>
        <div className="questions-actions">
          <button onClick={handleCopyAll} className="btn btn-sm btn-outline" title="Copy All">
            📋 Copy All
          </button>
          <button onClick={handleDownload} className="btn btn-sm btn-outline" title="Download">
            💾 Download
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="questions-stats card">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{questions.length}</div>
            <div className="stat-label">Total Questions</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{totalMarks}</div>
            <div className="stat-label">Total Marks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{Math.ceil(totalMarks * 1.5)}</div>
            <div className="stat-label">Minutes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{difficulty}</div>
            <div className="stat-label">Difficulty</div>
          </div>
        </div>
      </div>

      {/* Difficulty Breakdown */}
      {Object.keys(difficultyBreakdown).length > 1 && (
        <div className="difficulty-breakdown card">
          <h4>Difficulty Distribution:</h4>
          <div className="breakdown-bars">
            {Object.entries(difficultyBreakdown).map(([level, count]) => (
              <div key={level} className="breakdown-item">
                <span className="breakdown-label">{level}</span>
                <div className="breakdown-bar-container">
                  <div
                    className="breakdown-bar"
                    style={{
                      width: `${(count / questions.length) * 100}%`,
                      background: getDifficultyColor(level),
                    }}
                  ></div>
                </div>
                <span className="breakdown-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="questions-list">
        {questions.map((question, idx) => (
          <div key={idx} className="question-item card">
            <div className="question-number-badge">{idx + 1}</div>
            
            <div className="question-header-row">
              <div className="question-meta">
                <span
                  className="difficulty-badge"
                  style={{ background: getDifficultyColor(question.difficulty) }}
                >
                  {question.difficulty}
                </span>
                <span className="category-badge">{question.category}</span>
                {question.marks && (
                  <span className="marks-badge">{question.marks} marks</span>
                )}
              </div>
            </div>

            <div className="question-text">
              <strong>Q:</strong> {question.question}
            </div>

            <div className="question-answer">
              <details>
                <summary>
                  <strong>💡 Show Answer</strong>
                </summary>
                <div className="answer-content">
                  <p>
                    <strong>Answer:</strong>
                  </p>
                  <p style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{question.answer}</p>
                  
                  {question.diagram && (
                    <>
                      <p>
                        <strong>📊 Diagram:</strong>
                      </p>
                      <pre className="diagram-box" style={{
                        background: "#f3f4f6",
                        padding: "12px",
                        borderRadius: "6px",
                        overflow: "auto",
                        fontFamily: "monospace",
                        fontSize: "12px"
                      }}>
                        {question.diagram}
                      </pre>
                      {question.diagramDescription && (
                        <p><em>Diagram Description: {question.diagramDescription}</em></p>
                      )}
                    </>
                  )}
                  
                  {question.explanation && (
                    <>
                      <p>
                        <strong>Explanation:</strong>
                      </p>
                      <p className="explanation-text" style={{ whiteSpace: "pre-wrap" }}>{question.explanation}</p>
                    </>
                  )}
                  
                  {question.keyPoints && question.keyPoints.length > 0 && (
                    <>
                      <p>
                        <strong>Key Points to Remember:</strong>
                      </p>
                      <ul className="key-points">
                        {question.keyPoints.map((point, i) => (
                          <li key={i}>{point}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </details>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="questions-footer">
        <button
          onClick={() => setQuestions([])}
          className="btn btn-primary"
        >
          Generate New Set
        </button>
      </div>
    </div>
  );
};

export default ExamQuestions;
