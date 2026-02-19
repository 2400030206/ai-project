# Frontend-Backend Integration Map

## API Endpoint to Frontend Component Mapping

This document shows how each frontend component connects to the backend API.

---

## 📂 **PDF Upload Component**

**Frontend:** `src/components/Uploadpdf.js`
**Backend Endpoints:**
```javascript
POST   /api/pdf/upload
GET    /api/pdf/{id}/text
```

**Integration Code (src/services/api.js):**
```javascript
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE}/pdf/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

---

## 🤖 **AI Explanation Component**

**Frontend:** `src/components/AIExplanation.js`
**Backend Endpoint:**
```javascript
POST   /api/ai/explain
```

**Request:**
```json
{
  "content": "String - Text to explain",
  "mode": "simple|exam|advanced",
  "language": "en"
}
```

**Response:**
```json
{
  "explanation": "Generated explanation text",
  "mode": "simple"
}
```

---

## 📝 **Quiz Component**

**Frontend:** `src/components/Quiz.js`
**Backend Endpoints:**
```javascript
POST   /api/quiz/generate
POST   /api/quiz/submit
```

**Generate Quiz Request:**
```json
{
  "content": "Learning material text",
  "type": "mcq|true-false|one-line",
  "count": 10
}
```

**Generate Quiz Response:**
```json
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "mcq",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why A is correct"
    }
  ]
}
```

**Submit Quiz Request:**
```
Query Param: quizId=123
Body: { "q1": "answer1", "q2": "answer2" }
```

**Submit Quiz Response:**
```json
{
  "quizId": "123",
  "totalCount": 10,
  "correctCount": 8,
  "scorePercentage": 80.0,
  "passed": true
}
```

---

## 🎴 **Flashcards Component**

**Frontend:** `src/components/Flashcards.js`
**Backend Endpoint:**
```javascript
POST   /api/flashcards/generate
```

**Request:**
```json
{
  "content": "Study material text",
  "count": 20
}
```

**Response:**
```json
{
  "flashcards": [
    {
      "question": "What is X?",
      "answer": "X is..."
    }
  ]
}
```

**Frontend Integration:**
```javascript
// src/services/api.js
export const generateFlashcards = async (content, count) => {
  const response = await axios.post(`${API_BASE}/flashcards/generate`, {
    content,
    count
  });
  return response.data;
};
```

---

## 📊 **Smart Summary Component**

**Frontend:** `src/components/SmartSummary.js`
**Backend Endpoint:**
```javascript
POST   /api/summary/generate
```

**Request:**
```json
{
  "content": "Long text to summarize",
  "type": "concise|detailed|bullet|study"
}
```

**Response:**
```json
{
  "title": "Summary title",
  "overview": "Brief overview",
  "keyPoints": ["Point 1", "Point 2"],
  "topics": ["Topic 1", "Topic 2"],
  "conclusion": "Summary conclusion",
  "wordCount": 1500,
  "readingTime": 8
}
```

---

## 📚 **Exam Questions Component**

**Frontend:** `src/components/ExamQuestions.js`
**Backend Endpoint:**
```javascript
POST   /api/exam-questions/generate
```

**Request:**
```json
{
  "content": "Study material",
  "difficulty": "easy|medium|hard|mixed",
  "category": "theory|application|numerical|short|long|all",
  "count": 10
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "Question text",
      "difficulty": "medium",
      "category": "theory",
      "marks": 5,
      "expectedAnswer": "What should be covered",
      "explanation": "How to answer",
      "keyPoints": ["Point 1", "Point 2"]
    }
  ]
}
```

---

## 📖 **Revision Notes (Dashboard Feature)**

**Frontend:** `src/pages/Dashboard.js` (Revision Notes tab)
**Backend Endpoint:**
```javascript
POST   /api/revision/generate
```

**Request:**
```json
{
  "content": "Content to create revision notes from"
}
```

**Response:**
```json
{
  "title": "Revision Notes: Topic",
  "sections": [
    {
      "heading": "Key Concepts",
      "points": ["Point 1", "Point 2"]
    }
  ],
  "tips": ["Study tip 1", "Study tip 2"]
}
```

---

## 🎥 **Video/Lecture (Dashboard Feature)**

**Frontend:** `src/components/VideoPlayer.js` / Dashboard
**Backend Endpoint:**
```javascript
POST   /api/lecture/generate
```

**Request:**
```json
{
  "content": "Content to create lecture from"
}
```

**Response:**
```json
{
  "title": "Lecture title",
  "content": [
    {
      "heading": "Introduction",
      "text": "Lecture content",
      "type": "text|whiteboard"
    }
  ],
  "duration": 15
}
```

---

## ✍️ **Exam Mode**

**Frontend:** `src/pages/Exam.js`
**Backend Endpoints:**
```javascript
POST   /api/exam/start
POST   /api/exam/submit
```

**Start Exam Request:**
```json
{
  "title": "Final Exam",
  "duration": 60,
  "questionCount": 20,
  "content": "Content to generate questions from"
}
```

**Start Exam Response:**
```json
{
  "examId": "uuid-123",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "long",
      "marks": 10
    }
  ],
  "duration": 60
}
```

**Submit Exam Request:**
```json
{
  "examId": "uuid-123",
  "answers": {
    "q1": "Answer 1",
    "q2": "Answer 2"
  }
}
```

**Submit Exam Response:**
```json
{
  "examId": "uuid-123",
  "totalMarks": 100,
  "obtainedMarks": 85,
  "percentage": 85.0,
  "results": [
    {
      "questionId": "q1",
      "correct": true,
      "marksObtained": 10,
      "feedback": "Excellent answer"
    }
  ]
}
```

---

## 🔄 **Complete API Service (api.js)**

**Location:** `src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

// PDF APIs
export const uploadPDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE}/pdf/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const extractPDFText = async (pdfId) => {
  return axios.get(`${API_BASE}/pdf/${pdfId}/text`);
};

// AI APIs
export const generateExplanation = async (content, mode, language = 'en') => {
  return axios.post(`${API_BASE}/ai/explain`, {
    content,
    mode,
    language
  });
};

// Quiz APIs
export const generateQuiz = async (content, type, count) => {
  return axios.post(`${API_BASE}/quiz/generate`, {
    content,
    type,
    count
  });
};

export const submitQuiz = async (quizId, answers) => {
  return axios.post(`${API_BASE}/quiz/submit`, answers, {
    params: { quizId }
  });
};

// Flashcards API
export const generateFlashcards = async (content, count) => {
  return axios.post(`${API_BASE}/flashcards/generate`, {
    content,
    count
  });
};

// Summary API
export const generateSmartSummary = async (content, type) => {
  return axios.post(`${API_BASE}/summary/generate`, {
    content,
    type
  });
};

// Exam Questions API
export const generateExamQuestions = async (content, difficulty, category, count) => {
  return axios.post(`${API_BASE}/exam-questions/generate`, {
    content,
    difficulty,
    category,
    count
  });
};

// Revision Notes API
export const generateRevisionNotes = async (content) => {
  return axios.post(`${API_BASE}/revision/generate`, {
    content
  });
};

// Lecture API
export const generateLecture = async (content) => {
  return axios.post(`${API_BASE}/lecture/generate`, {
    content
  });
};

// Exam APIs
export const startExam = async (title, duration, questionCount, content) => {
  return axios.post(`${API_BASE}/exam/start`, {
    title,
    duration,
    questionCount,
    content
  });
};

export const submitExam = async (examId, answers) => {
  return axios.post(`${API_BASE}/exam/submit`, {
    examId,
    answers
  });
};
```

---

## 🔗 **Update Your Frontend api.js**

**Current Status:** Your frontend already has these endpoint calls in `src/services/api.js`

**Action Required:** 
1. Verify base URL in api.js:
   ```javascript
   const API_BASE = 'http://localhost:8080/api'; // ✅ Correct
   ```

2. All endpoints are already configured! ✅

---

## ✅ **Integration Checklist**

- [x] Backend running on port 8080
- [x] Frontend running on port 3000
- [x] CORS configured for localhost:3000
- [x] All 13 API endpoints implemented
- [x] All frontend components ready
- [x] API service layer complete

---

## 🧪 **Testing Integration**

### Test 1: PDF Upload
```bash
# Frontend: Upload a PDF via Uploadpdf component
# Backend logs: Check console for "Received PDF upload request"
```

### Test 2: Generate Quiz
```bash
# Frontend: Go to Quiz tab, generate questions
# Backend logs: "Generated 10 questions of type: mcq"
```

### Test 3: Flashcards
```bash
# Frontend: Flashcards tab, generate cards
# Backend logs: "Generated 20 flashcards"
```

---

## 🎯 **Data Flow Example**

```
User Action: Click "Generate Flashcards"
     │
     ▼
Frontend (Flashcards.js)
     │ calls generateFlashcards(content, 20)
     ▼
API Service (api.js)
     │ POST http://localhost:8080/api/flashcards/generate
     ▼
Backend Controller (FlashcardsController.java)
     │ @PostMapping("/generate")
     ▼
Service Layer (FlashcardsService.java)
     │ generateFlashcards(request)
     ▼
Business Logic
     │ Creates FlashcardDTO objects
     ▼
Response (FlashcardsResponse)
     │ { flashcards: [{question, answer}, ...] }
     ▼
Frontend receives data
     │ Updates state, renders cards
     ▼
User sees flashcards! 🎴
```

---

## 🚀 **Start Both Servers**

**Terminal 1 - Backend:**
```bash
cd c:\Users\saisa\desktop\Desktop\kli\ai-learning-backend
java -jar target\ai-learning-backend-1.0.0.jar
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\saisa\desktop\Desktop\kli\ai-learning-frontend
npm start
```

**Access:** http://localhost:3000

---

**Status:** ✅ Full-Stack Integration Complete!
