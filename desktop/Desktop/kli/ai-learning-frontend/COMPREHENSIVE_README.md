# AI Learning Platform - Frontend

A comprehensive, production-ready React application for an AI-powered learning platform with PDF analysis, smart quiz generation, secure exam mode, and multi-language support.

## 🚀 Features

### Core Features
- **📄 PDF Upload & Analysis**: Upload PDF files and extract text using backend AI
- **🤖 AI Explanations**: Get AI-powered explanations in multiple difficulty levels
- **📝 Smart Quiz System**: Auto-generated MCQ, True/False, and one-line answer questions
- **📚 AI Lecture Mode**: Interactive whiteboard-style teaching with scene-based explanations
- **🎯 Secure Exam Mode**: Proctored exam environment with tab-switch detection and auto-submit
- **📊 Review Mode**: Detailed answer review with explanations and learning recommendations
- **🔊 Voice Read-Out**: Browser speech synthesis with adjustable speed
- **⏱️ 5-Minute Revision**: Quick summaries for fast learning

### Advanced Features
- **Multi-Language Support**: English, Telugu, and Hindi
- **Three Learning Modes**: Simple (school-level), Exam (test-level), Advanced (deep-dive)
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX**: Beautiful gradient-based design with smooth animations
- **State Management**: Global context for user preferences and exam mode
- **Tab Switch Detection**: Smart detection of exam violations
- **Timer Management**: Real-time exam timer with critical time warnings
- **Whiteboard Canvas**: Draw and save notes during learning sessions

## 📋 Tech Stack

- **React 19.2** - Latest React with hooks
- **React Router DOM 7.13** - Client-side routing
- **Fetch API** - Backend communication
- **CSS3** - Modern responsive styling
- **Web Speech API** - Voice synthesis

## 🛠️ Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Spring Boot backend running on `http://localhost:8080`

### Setup Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**
Create a `.env` file in the project root:
```
REACT_APP_API_URL=http://localhost:8080/api
```

3. **Start Development Server**
```bash
npm start
```
The app will open at `http://localhost:3000`

4. **Build for Production**
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/              # Reusable React components
│   ├── Navbar.js           # Navigation bar with mode/language selectors
│   ├── Navbar.css
│   ├── Uploadpdf.js        # PDF upload with drag-drop
│   ├── Uploadpdf.css
│   ├── AIExplanation.js    # AI explanation display with voice
│   ├── AIExplanation.css
│   ├── Quiz.js             # Quiz component (MCQ, True/False, One-line)
│   ├── Quiz.css
│   ├── Whiteboard.js       # Interactive whiteboard for lectures
│   ├── Whiteboard.css
│   ├── VideoPlayer.js      # Video player placeholder
│   └── VideoPlayer.css
├── pages/                   # Page components
│   ├── Dashboard.js        # Main dashboard with all features
│   ├── Dashboard.css
│   ├── Exam.js            # Secure exam mode with proctoring
│   ├── Exam.css
│   ├── Review.js          # Exam review with detailed answers
│   └── Review.css
├── context/                 # Global state management
│   └── AppContext.js       # App-wide state (mode, language, exam state)
├── services/               # API services
│   └── api.js              # All backend API calls
├── utils/                  # Utility functions
│   ├── VoiceSynthesis.js  # Speech synthesis wrapper
│   └── ExamModeManager.js # Exam security & timer
├── styles/                # Global styles
│   └── global.css          # CSS variables, typography, utilities
├── App.js                 # Main app component with routing
├── App.css                # App layout styles
├── index.js              # React entry point
└── index.css             # Base styles
```

## 🎮 Usage Guide

### Dashboard
1. **Upload PDF**: Drag-drop or click to upload a PDF file
2. **Select Mode**: Choose between Simple, Exam, or Advanced
3. **Choose Language**: Select English, Telugu, or Hindi
4. **Explore Features**: 
   - **Explain Tab**: Read AI explanations with voice
   - **Quiz Tab**: Test knowledge with auto-generated questions
   - **Learn Tab**: Interactive whiteboard lessons

### Exam Mode
1. Click "Exam" in navigation
2. Configure exam duration and rules
3. Agree to terms and start
4. Answer all questions before submission
5. Tab switches are tracked and affect score
6. Auto-submit on page leave or time expiration

### Review Mode
1. Click "Review" in navigation
2. Enter your exam ID
3. See detailed score breakdown
4. Review each answer with explanations
5. Get recommendations for improvement

## 🔌 API Integration

The app communicates with Spring Boot backend. All endpoints are defined in `src/services/api.js`:

### PDF Operations
- `POST /api/pdf/upload` - Upload PDF
- `GET /api/pdf/{id}/extract` - Extract text

### AI Operations
- `POST /api/ai/explain` - Get explanation
- `POST /api/lecture/generate` - Generate lecture
- `POST /api/revision/content` - Get revision content

### Quiz Operations
- `POST /api/quiz/generate` - Generate quiz
- `POST /api/quiz/{id}/submit` - Submit answers

### Exam Operations
- `POST /api/exam/{id}/start` - Start exam
- `POST /api/exam/{id}/submit` - Submit exam
- `GET /api/exam/{id}/review` - Get review

## 🎨 Styling

The app uses CSS custom properties (CSS variables) for theming:

```css
--primary-color: #6366f1
--secondary-color: #10b981
--danger-color: #ef4444
--text-primary: #1e293b
--text-secondary: #64748b
```

All components are responsive and follow mobile-first design principles.

## 🔒 Security Features

### Exam Mode
- **Tab Switch Detection**: Detects when user leaves the tab
- **Page Leave Detection**: Catches attempts to navigate away
- **Keyboard Shortcut Blocking**: Prevents Ctrl+T, Ctrl+N, Ctrl+W
- **Right-Click Blocking**: Prevents context menu
- **Auto-Submit**: Automatically submits on violations
- **Tab Switch Counter**: Tracks violations for score adjustment

## 🎤 Voice Synthesis

The app uses Web Speech API for voice read-out:
- Supports multiple languages (en-US, te-IN, hi-IN)
- Adjustable speaking rate (0.5x to 2x)
- Pause/resume functionality
- Browser compatibility fallback

## 📱 Responsive Design

- **Desktop**: Full-featured experience
- **Tablet**: Optimized touch interface
- **Mobile**: Simplified navigation, single-column layout
- Breakpoints: 1024px, 768px, 480px

## 🚀 Performance Optimization

- Lazy loading for components
- Memoization for expensive operations
- CSS optimization with variables
- Minimal re-renders with context optimization
- Image optimization (emoji-based icons)

## 🐛 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Requires Web Speech API support for voice features

## 📚 Learning Resources

### For AI Explanation
- Simple mode: High school level, basic concepts
- Exam mode: Standardized test level, important points
- Advanced mode: University level, deep concepts

### Quiz Types
- **MCQ**: Multiple choice questions (4 options)
- **True/False**: Boolean questions
- **One-line**: Short answer questions

## 🤝 Contributing

This is a production-ready template. To extend:

1. Add new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update API calls in `src/services/api.js`
4. Extend global state in `src/context/AppContext.js`
5. Follow existing code style and patterns

## 📄 License

This project is part of the AI Learning Platform ecosystem.

## 🆘 Troubleshooting

### PDF Upload Fails
- Check backend API is running on port 8080
- Verify file size < 10MB
- Ensure CORS is enabled in backend

### Voice Not Working
- Check browser supports Web Speech API
- Verify language code is correct
- Check system volume settings

### Exam Auto-Submit Triggered
- Ensure continuous focus on exam window
- Disable browser extensions that interact with tabs
- Check page is fully loaded before starting

## 📞 Support

For issues or questions:
1. Check the feature in action
2. Verify backend API responses
3. Check browser console for errors
4. Review component props and state

---

**Built with ❤️ for learners worldwide**
