import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { uploadPDF, extractPDFText, getAIExplanation } from "../services/api";
import "./Uploadpdf.css";

const Uploadpdf = ({ onTextExtracted }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);
  const { updatePDF, updateExtractedText, updateAiExplanation, learningMode, language } =
    useContext(AppContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file");
      return;
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError("");
    setSuccess("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Upload PDF
      const uploadResponse = await uploadPDF(formData);
      const pdfId = uploadResponse.id;

      // Update context
      updatePDF({
        id: pdfId,
        name: file.name,
        uploadedAt: new Date(),
      });

      // Extract text
      const extractResponse = await extractPDFText(pdfId);
      const extractedText = extractResponse.text;

      // Update context
      updateExtractedText(extractedText);

      // Get AI explanation
      updateAiExplanation("", true); // Show loading
      const explanationResponse = await getAIExplanation(
        extractedText.substring(0, 2000), // Send first 2000 chars
        learningMode,
        language
      );

      updateAiExplanation(explanationResponse.explanation);

      setSuccess("PDF uploaded and analyzed successfully!");
      setFile(null);
      fileInputRef.current.value = "";

      // Notify parent component
      if (onTextExtracted) {
        onTextExtracted(extractedText);
      }
    } catch (err) {
      setError(err.message || "Failed to process PDF");
      console.error("Upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
      setError("");
      setSuccess("");
    } else {
      setError("Please drop a valid PDF file");
    }
  };

  return (
    <div className="upload-pdf-container">
      <div className="upload-header">
        <h2>📄 Upload & Analyze PDF</h2>
        <p className="upload-subtitle">Extract text and get AI-powered explanations</p>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Drop Zone */}
      <div
        className="drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="file-input"
          disabled={isLoading}
        />

        <div className="drop-zone-content">
          <div className="drop-icon">📁</div>
          <h3>Drag and drop your PDF here</h3>
          <p>or click to browse</p>
          <p className="file-info">PDF files up to 10MB</p>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="file-info-card card">
          <div className="flex-between">
            <div>
              <p className="file-name">
                <strong>Selected File:</strong> {file.name}
              </p>
              <p className="file-size text-muted">
                Size: {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                fileInputRef.current.value = "";
              }}
              className="btn btn-sm btn-outline"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="upload-actions">
        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="btn btn-primary btn-lg"
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            <>
              <span>⬆️</span>
              Upload & Analyze
            </>
          )}
        </button>
      </div>

      {/* Features List */}
      <div className="features-list">
        <h4>What we do:</h4>
        <ul>
          <li>✅ Extract text from PDF</li>
          <li>✅ Generate AI explanations</li>
          <li>✅ Adjust difficulty level</li>
          <li>✅ Support multiple languages</li>
        </ul>
      </div>
    </div>
  );
};

export default Uploadpdf;
