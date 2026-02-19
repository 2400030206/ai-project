# 🚀 AI Learning Platform - Startup Edition

A comprehensive AI-powered learning platform for students with PDF analysis, smart quizzes, exam modes, and ChatGPT-like learning assistant.

## ✨ Features

### 📚 Core Learning Features
- **PDF Upload & Analysis** - Upload study materials and AI extracts key concepts
- **Smart Quiz Generation** - AI generates varied MCQ, True/False, and one-line questions
- **Long Answer Questions** - 6-mark questions with diagrams and detailed solutions
- **Exam Mode** - Secure testing environment with proctoring (tab monitoring, time tracking)
- **AI Chat Assistant** - Ask questions and get instant explanations with diagrams
- **Smart Summaries** - AI generates concise summaries with key points
- **Flashcard Generation** - Create interactive study cards from content
- **Revision Notes** - Personalized revision content generation

### 🎯 Question & Assessment Types
- Multiple Choice Questions (MCQ)
- True/False statements  
- One-line answers
- Long-form answers with diagrams (6 marks)
- Auto-generated based on content difficulty

### 💬 AI Learning Assistant
- Natural language question answering
- Contextual explanations
- Visual diagrams and flowcharts
- Related topic suggestions
- Adjustable difficulty levels

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.2.2
- **Language**: Java 17
- **Build Tool**: Maven
- **Database**: H2 (Development), PostgreSQL (Production)
- **PDF Processing**: Apache PDFBox 3.0.1
- **NLP**: OpenNLP 2.3.2
- **Authentication**: JWT
- **API**: REST (13 endpoints)

### Frontend
- **Framework**: React 19.2.4
- **Routing**: React Router v6
- **Styling**: CSS3 with gradients and animations
- **State Management**: React Context API
- **HTTP Client**: Fetch API

## 📋 Prerequisites

### Required
- **Java 17+** (JDK)
- **Node.js 16+** with npm
- **Maven 3.8+**
- **Git**

### Optional
- PostgreSQL (for production)
- Docker & Docker Compose
- Nginx (for reverse proxy)

## 🚀 Quick Start (Development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd ai-learning-platform
```

### 2. Backend Setup

```bash
cd ai-learning-backend

# Install dependencies & build
mvn clean install

# Start backend server (develops on port 8080)
mvn spring-boot:run
# OR
java -jar target/ai-learning-backend-1.0.0.jar
```

Backend will be available at: `http://localhost:8080`

### 3. Frontend Setup

```bash
cd ai-learning-frontend

# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start
```

Frontend will be available at: `http://localhost:3000`

### 4. Default Login Credentials
```
Email: student@ailearning.com
Password: password123
```

## 🏗️ Project Structure

```
ai-learning-platform/
├── ai-learning-backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ailearning/
│   │   │   │   ├── controller/          (9 REST Controllers)
│   │   │   │   ├── service/             (9 Business Services)
│   │   │   │   ├── entity/              (3 DB Entities)
│   │   │   │   ├── dto/                 (20+ Data Transfer Objects)
│   │   │   │   ├── config/              (Spring Configuration)
│   │   │   │   └── security/            (JWT & Security)
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── target/ai-learning-backend-1.0.0.jar
│
├── ai-learning-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatBot.js               (AI Assistant)
│   │   │   ├── Quiz.js                  (Quiz Component)
│   │   │   ├── Navbar.js
│   │   │   ├── Whiteboard.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Exam.js
│   │   │   ├── Chat.js
│   │   │   ├── Review.js
│   │   │   └── Login.js
│   │   ├── services/
│   │   │   └── api.js                   (API Integration)
│   │   ├── context/
│   │   │   └── AppContext.js            (State Management)
│   │   ├── styles/
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── public/
│   └── build/
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### PDF & Content
- `POST /api/pdf/upload` - Upload PDF file
- `GET /api/pdf/{id}/text` - Extract text from PDF

### Quiz & Questions
- `POST /api/quiz/generate` - Generate quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

### Exam
- `POST /api/exam/start` - Start exam session
- `POST /api/exam/submit` - Submit exam

### AI Features
- `POST /api/chat/ask` - Ask AI assistant a question
- `POST /api/lecture-notes/generate` - Generate lecture notes
- `POST /api/flashcards/generate` - Generate flashcards
- `POST /api/exam-questions/generate` - Generate exam questions
- `POST /api/revision/generate` - Generate revision notes

### Utilities
- `GET /api/test/hello` - Health check

## 🖥️ Production Deployment

### Option 1: Docker Deployment

#### Build Docker Images
```bash
# Backend
cd ai-learning-backend
docker build -t ai-learning-backend:latest .

# Frontend
cd ai-learning-frontend
docker build -t ai-learning-frontend:latest .
```

#### Run with Docker Compose
```bash
docker-compose up -d
```

### Option 2: Cloud Deployment

#### Deploy to AWS
```bash
# Package backend
cd ai-learning-backend
mvn clean package

# Upload JAR to EC2 or use Elastic Beanstalk
# Configure RDS for PostgreSQL database
```

#### Deploy to Azure
```bash
# Use Azure App Service for backend
# Use Azure Web App for frontend
# Use Azure Database for PostgreSQL
```

#### Deploy to Heroku
```bash
# Backend deployment
cd ai-learning-backend
heroku login
heroku create ai-learning-backend
git push heroku main

# Frontend deployment (Netlify recommended)
cd ai-learning-frontend
npm run build
# Deploy build/ folder to Netlify
```

### Option 3: Traditional Server

```bash
# On Ubuntu/Debian server with Java 17 and Node.js installed

# Backend
nohup java -jar ai-learning-backend-1.0.0.jar > backend.log 2>&1 &

# Frontend (with nginx reverse proxy)
npm run build
# Copy build folder to /var/www/html
```

## 🔐 Environment Configuration

### Backend (.env or application.properties)
```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database (Development)
spring.datasource.url=jdbc:h2:mem:ailearning
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# Database (Production - PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/ailearning
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL10Dialect

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=86400000

# CORS
app.cors.allowed-origins=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ASSETS_URL=http://localhost:8080
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  name VARCHAR(255),
  level VARCHAR(50),
  created_at TIMESTAMP
);
```

### PDFs Table
```sql
CREATE TABLE pdfs (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  filename VARCHAR(255),
  content LONGTEXT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Quiz Results Table
```sql
CREATE TABLE quiz_results (
  id BIGINT PRIMARY KEY,
  user_id BIGINT,
  pdf_id BIGINT,
  score DECIMAL(5,2),
  total_questions INT,
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 Testing

### Backend Tests
```bash
cd ai-learning-backend
mvn test
```

### Frontend Tests
```bash
cd ai-learning-frontend
npm test
```

## 🚦 Health Check

```bash
# Backend health
curl http://localhost:8080/api/test/hello

# Frontend health
curl http://localhost:3000

# Chat API health
curl http://localhost:8080/api/chat/health
```

## 📈 Performance Optimization

### Backend
- Enable caching for frequently accessed data
- Use connection pooling
- Implement pagination for large datasets
- Use lazy loading for PDFs

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Minify CSS/JS in production
- Use CDN for static assets

## 🔧 Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080
# Kill process
kill -9 <PID>
```

### CORS Errors
- Ensure backend CORS is configured correctly
- Check frontend API URL matches backend origin
- Verify headers are set properly

### PDF Upload Failed
- Ensure file size < 50MB
- Check file format is PDF
- Verify disk space available

### Chat API Not Responding
- Check backend is running
- Verify API endpoint URL is correct
- Check network connectivity

## 📚 Learning Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Apache PDFBox Guide](https://pdfbox.apache.org)
- [JWT Authentication](https://jwt.io)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 💼 Business Model

### Free Tier
- Basic quiz generation (5 questions/day)
- PDF upload (10MB limit)
- Limited chat questions (10/day)

### Premium Tier ($4.99/month)
- Unlimited quiz generation
- Unlimited PDF uploads (100MB)
- Unlimited chat questions with AI
- Exam mode with proctoring
- Detailed analytics

### Enterprise Tier (Custom)
- School/University licenses
- Custom branding
- Admin dashboard
- Student management
- Progress tracking

## 📞 Support

- Email: support@ailearning.com
- Documentation: docs.ailearning.com
- Issues: Report on GitHub

## 🎯 Roadmap

- [ ] Mobile app (iOS/Android)
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard
- [ ] Integration with LMS (Moodle, Canvas)
- [ ] Multilingual support
- [ ] Voice-to-text questions
- [ ] Video explanation generation
- [ ] Live tutoring features

---

**Built with ❤️ for students worldwide**
