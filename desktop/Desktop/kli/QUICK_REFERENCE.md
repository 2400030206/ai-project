# 📋 Quick Reference Card

## 🎯 Essential Commands

### Frontend
```bash
npm install              # Install dependencies
npm start               # Start dev server (port 3000)
npm run build           # Build for production
npm test                # Run tests
npm run build -- --stats  # Check bundle size
```

### Backend
```bash
mvn clean install       # Full build (includes tests)
mvn clean install -DskipTests  # Build without tests
mvn spring-boot:run     # Start dev server (port 8080)
mvn test                # Run tests
mvn dependency:tree     # View dependency tree
```

### Docker
```bash
docker build -t ai-learning-backend .  # Build backend image
docker build -t ai-learning-frontend . # Build frontend image
docker-compose up                      # Start all services
docker-compose down                    # Stop all services
docker-compose logs -f                 # View logs
docker ps                              # List running containers
docker exec -it container_name bash    # SSH into container
```

### Git
```bash
git status              # Check status
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push origin main    # Push to remote
git clone <url>         # Clone repository
git pull origin main    # Pull latest changes
```

### General
```bash
# Kill process on port
lsof -i :8080          # List processes on port 8080
kill -9 <PID>          # Kill process

# Check installation
java -version
node --version
mvn --version
npm --version
git --version

# Find files
find . -name "*.java" -type f
find . -name "*.js" -not -path "*/node_modules/*"
```

---

## 🌐 API Endpoints

### Authentication
```
POST /api/auth/register
  Body: { email, password, fullName }

POST /api/auth/login
  Body: { email, password }
  Returns: { token, user }

POST /api/auth/logout
  Headers: { Authorization: Bearer <token> }

GET /api/auth/verify
  Headers: { Authorization: Bearer <token> }
```

### PDF Management
```
POST /api/pdfs/upload
  Body: FormData { file }
  Returns: { id, fileName, uploadedAt, pageCount }

GET /api/pdfs
  Returns: [{ id, fileName, uploadedAt, pageCount }]

GET /api/pdfs/{id}
  Returns: { id, fileName, content, uploadedAt }

GET /api/pdfs/{id}/text
  Returns: { text }

DELETE /api/pdfs/{id}
```

### Quiz
```
POST /api/quizzes/generate
  Body: { pdfId, difficulty, numberOfQuestions }
  Returns: [{ id, question, options, correctAnswer, explanation }]

GET /api/quizzes/{id}
  Returns: quiz object

POST /api/quiz-responses
  Body: { quizId, answer }
  Returns: { isCorrect, explanation }

GET /api/quiz-responses/user/me
  Returns: [{ quizId, answer, isCorrect, timestamp }]
```

### Exam
```
POST /api/exams/generate
  Body: { pdfId, difficulty }
  Returns: [{ id, question, questionType, marks, diagram, answer }]

GET /api/exams/{id}
  Returns: exam object

POST /api/exam-attempts
  Body: { examId, answers: [{ questionId, answer }] }
  Returns: { totalMarks, score, percentage, review: [{ question, userAnswer, correctAnswer }] }

GET /api/exam-attempts/user/me
  Returns: [exam attempts]
```

### Chat
```
POST /api/chat/ask
  Body: { message, topic, difficulty, context }
  Returns: {
    response,
    explanation,
    keyPoints: [string],
    diagram,
    relatedTopics,
    hasVisualAid
  }

GET /api/chat/health
  Returns: { status: "ok" }
```

### Users
```
GET /api/users/me
  Headers: { Authorization: Bearer <token> }
  Returns: { id, email, fullName, createdAt }

PUT /api/users/me
  Body: { fullName, preferences }
  Returns: updated user

GET /api/users/{id}/progress
  Returns: { quizzesTaken, examsTaken, avgScore }
```

### Admin
```
GET /api/admin/users
  Returns: [users]

GET /api/admin/stats
  Returns: { totalUsers, totalQuizzes, avgScore }

DELETE /api/admin/users/{id}

POST /api/admin/reset-db
  ⚠️ WARNING: Resets entire database
```

### Health Check
```
GET /api/test/hello
  Returns: { message: "Hello from AI Learning Backend!" }

GET /swagger-ui.html
  Opens: Interactive API documentation
```

---

## 🔧 Port Reference

```
Frontend: 3000   http://localhost:3000
Backend:  8080   http://localhost:8080
Database: 5432   postgres://localhost:5432
Redis:    6379   redis://localhost:6379
Nginx:    80     http://localhost
```

---

## 📚 Database Tables

```sql
-- Users
users (id, email, password_hash, full_name, created_at, updated_at)

-- PDFs
pdfs (id, user_id, file_name, file_path, page_count, created_at)

-- Quizzes
quizzes (id, pdf_id, question, options[], correct_answer, explanation)
quiz_responses (id, user_id, quiz_id, answer, is_correct, created_at)

-- Exams
exams (id, pdf_id, question, question_type, marks, diagram, answer)
exam_attempts (id, user_id, exam_id, answers{}, score, created_at)

-- Chat
chat_messages (id, user_id, message, response, created_at)

-- Whiteboard
whiteboards (id, user_id, content, created_at, updated_at)
```

---

## 🔑 Credentials (Development Only)

```
Student Login:
  Email: student@ailearning.com
  Password: password123

Admin Login:
  Email: admin@ailearning.com
  Password: password123

Database (H2 Console):
  URL: jdbc:h2:mem:ailearning
  User: sa
  Password: (blank)
```

---

## 📁 Key File Locations

```
Frontend:
├── src/App.js                 # Main app component
├── src/index.js              # Entry point
├── src/components/           # UI components
├── src/pages/                # Page components
├── src/services/api.js       # API client
└── package.json              # Dependencies

Backend:
├── src/main/java/com/ailearning/
│   ├── controller/           # REST endpoints
│   ├── service/              # Business logic
│   ├── entity/               # Database entities
│   └── dto/                  # Data transfer objects
├── src/main/resources/
│   ├── application.yml       # Configuration
│   └── data.sql              # Sample data
└── pom.xml                   # Maven dependencies
```

---

## 🐛 Quick Debugging

### Frontend Debug
```javascript
// Console (F12)
console.log(value)
console.error(error)
debugger;  // Pause execution

// Network tab
// Check API requests/responses

// React DevTools extension
// Inspect component props/state
```

### Backend Debug
```bash
# View logs
tail -f logs/application.log

# Enable debug logging
# In application.yml:
logging:
  level:
    com.ailearning: DEBUG

# Test endpoint
curl -X GET http://localhost:8080/api/test/hello

# Test with data
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@ailearning.com","password":"password123"}'
```

---

## ⚡ Performance Metrics

### Targets
```
Frontend Score:
  Lighthouse: 90+
  Bundle Size: < 500KB
  Load Time: < 3s

Backend Performance:
  API Response: < 500ms
  Database Query: < 100ms
  JVM Memory: < 1GB
  CPU: < 50%
```

### Monitoring Tools
```
Frontend:
  - Lighthouse (Chrome DevTools)
  - WebPageTest
  - PageSpeed Insights

Backend:
  - JProfiler
  - YourKit
  - New Relic
  - DataDog

Database:
  - pgAdmin
  - DBeaver
  - pg_stat_statements
```

---

## 🔒 Security Checklist

- [ ] No hardcoded secrets in code
- [ ] Use environment variables
- [ ] Validate all input
- [ ] Escape user output
- [ ] Use HTTPS in production
- [ ] Set secure JWT secrets
- [ ] Enable CORS only for trusted origins
- [ ] Use password hashing (BCrypt)
- [ ] Implement rate limiting
- [ ] Log security events
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 📊 Environment Variables

### Backend (.env)
```
JAVA_HOME=/usr/lib/jvm/java-17-openjdk
MAVEN_OPTS=-Xmx2G
SERVER_PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/ailearning
DB_USER=postgres
DB_PASSWORD=xxxx
JWT_SECRET=your-256-bit-secret-key
JWT_EXPIRATION=604800000
SPRING_PROFILE=dev
LOG_LEVEL=INFO
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENV=development
REACT_APP_DEBUG=true
PUBLIC_URL=/
```

---

## 📦 Dependency Versions

### Frontend
```json
{
  "react": "^19.2.4",
  "react-router-dom": "^6.0.0",
  "axios": "^1.6.0",
  "react-pdf": "^8.0.0"
}
```

### Backend
```xml
<spring-boot.version>3.2.2</spring-boot.version>
<java.version>17</java.version>
<pdfbox.version>3.0.1</pdfbox.version>
<opennlp.version>2.3.2</opennlp.version>
<jwt.version>0.12.3</jwt.version>
<lombok.version>1.18.30</lombok.version>
```

---

## 🚀 Deployment Commands

### Local
```bash
./start.sh          # Linux/Mac
start.bat           # Windows
```

### Docker
```bash
docker-compose up -d
docker-compose ps
docker-compose logs -f
```

### AWS
```bash
eb init -p java-17-corretto-17 ai-learning
eb create production
eb deploy
```

### Azure
```bash
az webapp create --resource-group mygroup --plan myplan --name ai-learning
az webapp deployment source config-zip --resource-group mygroup --name ai-learning --src app.zip
```

### Heroku
```bash
heroku login
heroku create ai-learning
git push heroku main
```

---

## 🆘 Emergency Commands

### If Everything is Broken
```bash
# Nuclear option - start fresh
rm -rf node_modules
rm -rf target
rm package-lock.json

npm install
mvn clean install -DskipTests

npm start        # Terminal 1
mvn spring-boot:run  # Terminal 2
```

### Restore from Backup
```bash
# Database backup/restore
pg_dump ailearning > backup.sql
psql ailearning < backup.sql

# Code backup
git log --oneline  # See commit history
git reset --hard <commit>  # Go back to commit
```

---

## 📞 Support Resources

| Issue | Command |
|-------|---------|
| Port in use | `lsof -i :PORT` |
| Check logs | `tail -f logs/app.log` |
| Clear cache | `npm cache clean --force` |
| Check versions | `java -v`, `npm -v`, `mvn -v` |
| API test | `curl http://localhost:8080/api/test/hello` |
| DB connect | `psql -U postgres -d ailearning` |
| View processes | `ps aux`, Task Manager |

---

## 🎓 Learning Resources

- **React**: https://react.dev
- **Spring Boot**: https://spring.io/projects/spring-boot
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Docker**: https://docs.docker.com/
- **Git**: https://git-scm.com/doc
- **REST API**: https://restfulapi.net/
- **JWT**: https://jwt.io/

---

## ✅ Pre-Launch Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Both servers running
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Environment variables set
- [ ] SSL certificate ready
- [ ] Documentation updated
- [ ] Backups configured
- [ ] Monitoring tools running
- [ ] Team trained
- [ ] Stakeholders notified

---

*Last Updated: February 2024*
*Keep this card with you! 📋*
