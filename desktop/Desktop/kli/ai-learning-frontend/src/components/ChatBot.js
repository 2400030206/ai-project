import React, { useContext, useRef, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import "./ChatBot.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "👋 Hello! I'm your AI Learning Assistant. Ask me anything about your studies!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [difficulty, setDifficulty] = useState("intermediate");
  const [topic, setTopic] = useState("");
  const messagesEndRef = useRef(null);
  const { extractedText } = useContext(AppContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          topic: topic || "general",
          difficulty: difficulty,
          context: extractedText || "",
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add bot response with multiple parts
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: data.response,
        explanation: data.explanation,
        keyPoints: data.keyPoints,
        diagram: data.diagram,
        relatedTopics: data.relatedTopics,
        hasVisualAid: data.hasVisualAid,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        text: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <div className="chat-header-content">
          <h2>🤖 AI Learning Assistant</h2>
          <p>Ask me anything about your studies</p>
        </div>
        <div className="chat-settings">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="difficulty-select"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            type="text"
            placeholder="Enter topic (optional)..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="topic-input"
          />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === "user" ? "👤" : "🤖"}
            </div>

            <div className="message-content">
              <p className="message-text">{message.text}</p>

              {message.explanation && (
                <details className="message-details">
                  <summary>📖 Detailed Explanation</summary>
                  <p className="explanation">{message.explanation}</p>
                </details>
              )}

              {message.keyPoints && message.keyPoints.length > 0 && (
                <div className="key-points">
                  <h4>🔑 Key Points:</h4>
                  <ul>
                    {message.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {message.hasVisualAid && message.diagram && (
                <details className="diagram-details">
                  <summary>📊 Visual Diagram</summary>
                  <pre className="diagram">{message.diagram}</pre>
                </details>
              )}

              {message.relatedTopics && (
                <p className="related-topics">📚 {message.relatedTopics}</p>
              )}

              <small className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message bot">
            <div className="message-icon">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question... (e.g., 'What is photosynthesis?' or 'Explain how to solve this problem')"
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="send-button"
        >
          {isLoading ? "..." : "📤 Send"}
        </button>
      </form>

      <div className="chat-suggestions">
        <p>Try asking:</p>
        <div className="suggestion-buttons">
          <button
            onClick={() => setInputValue("What is the main concept here?")}
            className="suggestion-btn"
          >
            What is the main concept?
          </button>
          <button
            onClick={() => setInputValue("Can you give me an example?")}
            className="suggestion-btn"
          >
            Give me an example
          </button>
          <button
            onClick={() => setInputValue("Why is this important?")}
            className="suggestion-btn"
          >
            Why is this important?
          </button>
          <button
            onClick={() => setInputValue("How does this work?")}
            className="suggestion-btn"
          >
            How does this work?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
