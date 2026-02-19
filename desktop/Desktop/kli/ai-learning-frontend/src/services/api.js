const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// PDF Operations
export async function uploadPDF(formData) {
  const response = await fetch(`${API_BASE_URL}/pdf/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("PDF upload failed");
  return response.json();
}

export async function extractPDFText(pdfId) {
  const response = await fetch(`${API_BASE_URL}/pdf/${pdfId}/text`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Text extraction failed");
  return response.json();
}

// AI Explanation
export async function getAIExplanation(content, mode = "simple", language = "en") {
  const response = await fetch(`${API_BASE_URL}/ai/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, mode, language }),
  });
  if (!response.ok) throw new Error("AI explanation failed");
  return response.json();
}

// Quiz/Questions
export async function generateQuiz(content, type = "mcq", count = 5) {
  const response = await fetch(`${API_BASE_URL}/quiz/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, type, count }),
  });
  if (!response.ok) throw new Error("Quiz generation failed");
  return response.json();
}

export async function generateAIQuiz(content, type = "mcq", count = 5) {
  const response = await fetch(`${API_BASE_URL}/quiz/generate-ai`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, type, count }),
  });
  if (!response.ok) throw new Error("AI Quiz generation failed");
  return response.json();
}

export async function submitQuizAnswers(quizId, answers) {
  const response = await fetch(`${API_BASE_URL}/quiz/submit?quizId=${quizId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!response.ok) throw new Error("Quiz submission failed");
  return response.json();
}

// AI Lecture/Whiteboard
export async function generateLecture(content) {
  const response = await fetch(`${API_BASE_URL}/lecture/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Lecture generation failed");
  return response.json();
}

// Revision
export async function generateRevisionNotes(content) {
  const response = await fetch(`${API_BASE_URL}/revision/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error("Revision notes generation failed");
  return response.json();
}
// Smart Summary
export async function generateSmartSummary(content, type = "concise", language = "en") {
  const response = await fetch(`${API_BASE_URL}/summary/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, type, language }),
  });
  if (!response.ok) throw new Error("Summary generation failed");
  return response.json();
}

// Video Management
export async function getVideos(language = "en") {
  const response = await fetch(`${API_BASE_URL}/videos?language=${language}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch videos");
  return response.json();
}

export async function uploadVideo(formData) {
  const response = await fetch(`${API_BASE_URL}/videos/upload`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Video upload failed");
  return response.json();
}

export async function deleteVideo(videoId) {
  const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Video deletion failed");
  return response.json();
}
// Exam Mode
export async function startExam(title, duration, questionCount, content) {
  const response = await fetch(`${API_BASE_URL}/exam/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, duration, questionCount, content }),
  });
  if (!response.ok) throw new Error("Exam start failed");
  return response.json();
}

export async function submitExam(examId, answers) {
  const response = await fetch(`${API_BASE_URL}/exam/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ examId, answers }),
  });
  if (!response.ok) throw new Error("Exam submission failed");
  return response.json();
}

// Review - TODO: Backend endpoint not yet implemented
// export async function getExamReview(examId) {
//   const response = await fetch(`${API_BASE_URL}/exam/${examId}/review`, {
//     method: "GET",
//   });
//   if (!response.ok) throw new Error("Review fetch failed");
//   return response.json();
// }

// Flashcards
export async function generateFlashcards(content, count = 10, language = "en") {
  const response = await fetch(`${API_BASE_URL}/flashcards/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, count, language }),
  });
  if (!response.ok) throw new Error("Flashcards generation failed");
  return response.json();
}

// Important Exam Questions
export async function generateExamQuestions(
  content,
  difficulty = "medium",
  count = 10,
  category = "all"
) {
  const response = await fetch(`${API_BASE_URL}/exam-questions/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, difficulty, count, category }),
  });
  if (!response.ok) throw new Error("Exam questions generation failed");
  return response.json();
}

// Chat/AI Assistant
export async function askQuestion(message, topic = "general", difficulty = "intermediate", context = "") {
  const response = await fetch(`${API_BASE_URL}/chat/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, topic, difficulty, context }),
  });
  if (!response.ok) throw new Error("Chat request failed");
  return response.json();
}

// Localization
export async function getSupportedLanguages() {
  const response = await fetch(`${API_BASE_URL}/localization/languages`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch languages");
  return response.json();
}

export async function getLanguageName(languageCode) {
  const response = await fetch(`${API_BASE_URL}/localization/language/${languageCode}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch language name");
  return response.json();
}

export async function getTranslations(language = "en") {
  const response = await fetch(`${API_BASE_URL}/localization/translations?language=${language}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch translations");
  return response.json();
}

export async function translateKey(key, language = "en") {
  const response = await fetch(`${API_BASE_URL}/localization/translate/${key}?language=${language}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to translate key");
  return response.text();
}

export async function detectLanguage(acceptLanguage = "") {
  const response = await fetch(`${API_BASE_URL}/localization/detect${acceptLanguage ? `?acceptLanguage=${acceptLanguage}` : ""}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to detect language");
  return response.text();
}

export async function validateLanguage(language) {
  const response = await fetch(`${API_BASE_URL}/localization/validate/${language}`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Language validation failed");
  return response.json();
}