import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { generateFlashcards } from "../services/api";
import "./Flashcards.css";

const Flashcards = ({ content }) => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState(10);
  const [showAll, setShowAll] = useState(false);

  const { language } = useContext(AppContext);

  const handleGenerateFlashcards = async () => {
    if (!content) {
      setError("Please upload a PDF first");
      return;
    }

    setIsLoading(true);
    setError("");
    setFlashcards([]);
    setCurrentIndex(0);
    setIsFlipped(false);

    try {
      const response = await generateFlashcards(content, count, language);
      setFlashcards(response.flashcards || []);
    } catch (err) {
      setError(err.message || "Failed to generate flashcards");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleDownload = () => {
    const flashcardsText = flashcards
      .map((card, idx) => `Card ${idx + 1}:\nQ: ${card.question}\nA: ${card.answer}\n`)
      .join("\n");

    const blob = new Blob([flashcardsText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "flashcards.txt";
    a.click();
  };

  if (flashcards.length === 0) {
    return (
      <div className="flashcards-container">
        <div className="flashcards-header">
          <h3>🎴 Flashcards</h3>
          <p className="flashcards-subtitle">Generate AI-powered flashcards for quick revision</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="flashcards-setup card">
          <div className="setup-group">
            <label htmlFor="flashcard-count">
              <strong>Number of Flashcards:</strong>
            </label>
            <input
              id="flashcard-count"
              type="number"
              min="5"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleGenerateFlashcards}
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
                Generate Flashcards
              </>
            )}
          </button>

          <div className="flashcards-features">
            <h4>Flashcard Features:</h4>
            <ul>
              <li>📚 AI-generated key concepts</li>
              <li>🔄 Flip to reveal answers</li>
              <li>🔀 Shuffle for better retention</li>
              <li>💾 Download for offline study</li>
              <li>📊 Track your progress</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h3>🎴 Flashcards Study Mode</h3>
        <div className="flashcards-actions">
          <button onClick={handleShuffle} className="btn btn-sm btn-outline" title="Shuffle">
            🔀 Shuffle
          </button>
          <button onClick={handleDownload} className="btn btn-sm btn-outline" title="Download">
            💾 Download
          </button>
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn btn-sm btn-outline"
            title="View All"
          >
            {showAll ? "📋 Hide All" : "📋 View All"}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="flashcard-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          Card {currentIndex + 1} of {flashcards.length}
        </p>
      </div>

      {!showAll ? (
        <>
          {/* Single Card View */}
          <div className="flashcard-viewer">
            <div
              className={`flashcard ${isFlipped ? "flipped" : ""}`}
              onClick={handleFlip}
            >
              <div className="flashcard-front">
                <div className="card-label">Question</div>
                <div className="card-content">
                  <p>{currentCard.question}</p>
                </div>
                <div className="card-hint">💡 Click to reveal answer</div>
              </div>
              <div className="flashcard-back">
                <div className="card-label">Answer</div>
                <div className="card-content">
                  <p>{currentCard.answer}</p>
                </div>
                <div className="card-hint">💡 Click to see question</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flashcard-navigation">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn btn-outline"
            >
              ← Previous
            </button>

            <button onClick={handleFlip} className="btn btn-primary">
              {isFlipped ? "🔄 See Question" : "🔄 Reveal Answer"}
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === flashcards.length - 1}
              className="btn btn-outline"
            >
              Next →
            </button>
          </div>

          {currentIndex === flashcards.length - 1 && (
            <div className="completion-message">
              <p>🎉 You've reached the end! Click shuffle to practice again.</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* All Cards View */}
          <div className="flashcards-grid">
            {flashcards.map((card, idx) => (
              <div key={idx} className="flashcard-mini card">
                <div className="mini-header">
                  <span className="mini-number">Card {idx + 1}</span>
                </div>
                <div className="mini-question">
                  <strong>Q:</strong> {card.question}
                </div>
                <div className="mini-answer">
                  <strong>A:</strong> {card.answer}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setFlashcards([]);
              setCurrentIndex(0);
            }}
            className="btn btn-primary"
          >
            Generate New Set
          </button>
        </>
      )}
    </div>
  );
};

export default Flashcards;
