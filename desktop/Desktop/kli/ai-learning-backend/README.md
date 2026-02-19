# AI Learning Platform - Backend

Spring Boot backend for the AI Learning Platform with comprehensive AI-powered learning features.

## 🚀 Features

- **PDF Upload & Processing**: Upload PDFs and extract text content
- **AI Explanations**: Generate simple, exam-focused, or advanced explanations
- **Quiz Generation**: Create MCQ, True/False, and One-line answer quizzes
- **Smart Flashcards**: Generate interactive Q&A flashcards
- **Smart Summaries**: Generate concise, detailed, bullet, or study-guide summaries
- **Exam Questions**: Generate exam questions with difficulty and category filters
- **Revision Notes**: Create structured revision notes with key points
- **Interactive Lectures**: Generate lecture content with whiteboard integration
- **Exam Management**: Start exam sessions and submit for scoring

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.2.2**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA** (Hibernate)
- **H2 Database** (Development)
- **PostgreSQL** (Production ready)
- **Apache PDFBox 3.0.1** (PDF processing)
- **Apache OpenNLP 2.3.2** (NLP operations)
- **Lombok** (Boilerplate reduction)
- **Maven** (Build tool)

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- (Optional) PostgreSQL for production

## 🔧 Installation

1. **Clone the repository**
```bash
cd ai-learning-backend
```

2. **Build the project**
```bash
mvn clean install
```

3. **Run the application**
```bash
mvn spring-boot:run
```

The server will start on `http://localhost:8080`

## 📁 Project Structure

```
ai-learning-backend/
├── src/main/java/com/ailearning/
│   ├── AiLearningApplication.java       # Main application
│   ├── config/
│   │   ├── SecurityConfig.java          # Security configuration
│   │   └── CorsConfig.java              # CORS configuration
│   ├── controller/                      # REST Controllers
│   │   ├── PDFController.java
│   │   ├── AIController.java
│   │   ├── QuizController.java
│   │   ├── FlashcardsController.java
│   │   ├── SummaryController.java
│   │   ├── ExamQuestionsController.java
│   │   ├── RevisionController.java
│   │   ├── LectureController.java
│   │   └── ExamController.java
│   ├── service/                         # Business logic
│   │   ├── PDFService.java
│   │   ├── AIService.java
│   │   ├── QuizService.java
│   │   ├── FlashcardsService.java
│   │   ├── SummaryService.java
│   │   ├── ExamQuestionsService.java
│   │   ├── RevisionService.java
│   │   ├── LectureService.java
│   │   └── ExamService.java
│   ├── repository/                      # Data access
│   │   ├── PDFRepository.java
│   │   ├── QuizRepository.java
│   │   └── ExamRepository.java
│   ├── entity/                          # JPA Entities
│   │   ├── PDF.java
│   │   ├── Quiz.java
│   │   └── Exam.java
│   └── dto/                            # Data Transfer Objects
│       └── (Request/Response DTOs)
└── src/main/resources/
    └── application.properties          # Configuration
```

## 🔌 API Endpoints

### PDF Management
- `POST /api/pdf/upload` - Upload a PDF file
- `GET /api/pdf/{id}/text` - Get extracted text

### AI Features
- `POST /api/ai/explain` - Generate AI explanation
- `POST /api/quiz/generate` - Generate quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `POST /api/flashcards/generate` - Generate flashcards
- `POST /api/summary/generate` - Generate smart summary
- `POST /api/exam-questions/generate` - Generate exam questions
- `POST /api/revision/generate` - Generate revision notes
- `POST /api/lecture/generate` - Generate lecture content

### Exam Management
- `POST /api/exam/start` - Start exam session
- `POST /api/exam/submit` - Submit exam

## 📝 Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration (H2 for development)
spring.datasource.url=jdbc:h2:mem:ailearningdb
spring.datasource.username=sa
spring.datasource.password=

# For PostgreSQL (Production)
# spring.datasource.url=jdbc:postgresql://localhost:5432/ailearning
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your-secret-key-here-change-in-production
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

## 🔒 Security

- JWT-based authentication
- BCrypt password encoding
- CORS enabled for `http://localhost:3000`
- Stateless session management

## 🧪 Testing

Run tests with:
```bash
mvn test
```

## 📦 Building for Production

```bash
mvn clean package
java -jar target/ai-learning-backend-0.0.1-SNAPSHOT.jar
```

## 🐳 Docker Support (Optional)

Create `Dockerfile`:
```dockerfile
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Build and run:
```bash
docker build -t ai-learning-backend .
docker run -p 8080:8080 ai-learning-backend
```

## 🤝 Integration with Frontend

The backend is designed to work with the React frontend running on `http://localhost:3000`. Ensure CORS is properly configured for your frontend URL.

## 📄 License

MIT License

## 👥 Contributors

AI Learning Platform Team

---

**Note**: This is a development version with mock AI implementations. For production, integrate with actual AI services like OpenAI API, Google Cloud AI, or custom ML models.
