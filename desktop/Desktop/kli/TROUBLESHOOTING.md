# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## Frontend Issues

### 1. Blank White Screen
**Symptoms:** App loads but nothing displays

**Solutions:**
```bash
# Clear cache
rm -r node_modules package-lock.json
npm install

# Check console for errors
# Open DevTools: F12
# Look at Console tab for red errors

# Rebuild
npm run build
npm start
```

**Check:**
- [ ] Is backend running on port 8080?
- [ ] Is frontend trying correct API URL?
- [ ] Are there any CORS errors in console?

---

### 2. API Calls Fail (404/500 errors)
**Error:** API endpoint not found or server error

**Solutions:**
```javascript
// Check API endpoint in api.js
const API_BASE_URL = 'http://localhost:8080';

// Verify endpoint exists
// POST /api/auth/login ✓
// POST /api/quizzes/generate ✓

// Check request format
const response = await axios.post('/api/auth/login', {
  email: 'student@ailearning.com',
  password: 'password123'
});
```

**Debug Steps:**
1. Open Network tab in DevTools (F12)
2. Try clicking login
3. Look for red requests
4. Click request → check Response tab
5. Read error message

---

### 3. CORS Error
**Error:** "Access to XMLHttpRequest blocked by CORS policy"

**Solution in Backend:**
```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

**Or at Controller:**
```java
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
  // endpoints
}
```

---

### 4. PDF Upload Not Working
**Problem:** Upload button doesn't upload PDF

**Check:**
```bash
# Backend PDF endpoint
POST /api/pdfs/upload

# Check if backend is running
curl http://localhost:8080/api/test/hello

# Check backend logs for errors
tail -f logs/application.log
```

**Frontend code:**
```javascript
const handleUpload = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post('/api/pdfs/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log('Upload success:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response?.data);
  }
};
```

---

### 5. Chat Assistant Not Responding
**Problem:** Chat doesn't send messages or returns no response

**Debug:**
```bash
# Test chat endpoint manually
curl -X POST http://localhost:8080/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is machine learning?",
    "topic": "AI",
    "difficulty": "beginner"
  }'

# Should return:
# {
#   "response": "...",
#   "explanation": "...",
#   "keyPoints": ["...", "...", "..."],
#   "diagram": "...",
#   "relatedTopics": "..."
# }
```

**Frontend Check:**
```javascript
// In ChatBot.js
const askQuestion = async (message) => {
  try {
    const response = await api.askQuestion({
      message,
      topic,
      difficulty
    });
    setMessages([...messages, {
      text: response.data.response,
      type: 'bot'
    }]);
  } catch (error) {
    console.error('Chat error:', error);
    // Show specific error to user
  }
};
```

---

### 6. Console Errors
**React Error Boundary Handling:**

```javascript
// In App.js or main component
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please refresh.</h1>;
    }
    return this.props.children;
  }
}

// Wrap app
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## Backend Issues

### 1. Maven Build Fails
**Error:** "BUILD FAILURE"

**Solutions:**
```bash
# Clean and retry
mvn clean install -DskipTests

# If dependency issues
mvn dependency:resolve
mvn clean install -U

# Check Java version
java -version  # Should be 17+

# Check Maven version
mvn --version  # Should be 3.8+
```

**Common causes:**
- Wrong Java version (need 17+)
- Missing/corrupted local repository
- Proxy issues in corporate environment

---

### 2. Server Won't Start
**Error:** Spring Boot fails to start

**Debug:**
```bash
# Check if port is in use
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Mac/Linux

# Kill process on port 8080
taskkill /PID <PID> /F  # Windows
kill -9 <PID>  # Mac/Linux

# Check logs
cat target/*exec.jar.original
java -jar target/*.jar --debug

# Try different port
java -jar target/*.jar --server.port=9090
```

**Application.yml check:**
```yaml
spring:
  application:
    name: ai-learning-backend
  jpa:
    hibernate:
      ddl-auto: update  # or create-drop for dev
  datasource:
    url: jdbc:h2:mem:ailearning
    username: sa
    password: 
server:
  port: 8080
  servlet:
    context-path: /
logging:
  level:
    root: INFO
    com.ailearning: DEBUG
```

---

### 3. Database Connection Error
**Error:** "Cannot connect to database" / "H2 connection failed"

**Solutions:**

If using **H2 (development):**
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:ailearning
    username: sa
    password: 
  h2:
    console:
      enabled: true
  jpa:
    hibernate:
      ddl-auto: create-drop
```

If using **PostgreSQL (production):**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ailearning
    username: postgres
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
```

**Check Database:**
```bash
# PostgreSQL check
psql -U postgres -d ailearning -c "SELECT 1;"

# Create database if missing
createdb -U postgres ailearning

# H2 Web Console
# Visit: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:ailearning
# User: sa
# Password: (leave blank)
```

---

### 4. JWT Authentication Issues
**Error:** 401 Unauthorized / Invalid JWT token

**Solutions:**

```java
// Check JWT Configuration
@Configuration
public class JwtConfig {
    public static final String JWT_SECRET = "your-256-bit-secret-key-change-in-production";
    public static final long JWT_EXPIRATION = 604800000; // 7 days
}

// Check token in request
// Header: Authorization: Bearer <token>

// Verify token generation
POST /api/auth/login
{
  "email": "student@ailearning.com",
  "password": "password123"
}
// Returns: { "token": "eyJhbGc..." }

// Use token in requests
Authorization: Bearer eyJhbGc...
```

**Test JWT:**
```bash
# Login to get token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@ailearning.com","password":"password123"}'
# Copy the token from response

# Use token in request
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer <token>"
```

---

### 5. NLP Processing Issues
**Error:** "OpenNLP model not found" / "Keyword extraction fails"

**Solutions:**
```java
// Ensure models are in resources
// src/main/resources/models/
//   ├── en-sent.bin
//   ├── en-pos-maxent.bin
//   └── en-tokenize.bin

// Download models if missing:
// https://opennlp.apache.org/models.html

// Check in QuizService/ChatService
try {
    InputStream tokenStream = getClass()
        .getResourceAsStream("/models/en-tokenize.bin");
    TokenizerModel tokenModel = new TokenizerModel(tokenStream);
    Tokenizer tokenizer = new TokenizerME(tokenModel);
} catch (Exception e) {
    logger.error("Model loading failed", e);
}
```

---

### 6. Memory/Performance Issues
**Symptoms:** App slows down, uses too much RAM

**Solutions:**
```bash
# Check memory usage
# On Windows Task Manager
# On Mac/Linux: top, ps aux

# Increase heap size
java -Xmx2G -Xms512M -jar target/*.jar

# Enable garbage collection logging
java -Xlog:gc:logs/gc.log -jar target/*.jar

# Profile with JVisualVM
jvisualvm

# Check database queries
# Enable SQL logging in application.yml
spring:
  jpa:
    show-sql: true
    properties:
      hibernate:
        use_sql_comments: true
        format_sql: true
        generate_statistics: true
  datasource:
    hikari:
      maximum-pool-size: 10
```

---

### 7. PDF Processing Issues
**Error:** "Error reading PDF" / "Text extraction fails"

**Solutions:**
```java
// PDFBox configuration
@Service
public class PdfService {
    public String extractText(MultipartFile file) {
        try {
            PDDocument document = PDDocument.load(file.getInputStream());
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            document.close();
            return text;
        } catch (IOException e) {
            logger.error("PDF processing error", e);
            throw new RuntimeException("Failed to process PDF");
        }
    }
}

// Test with sample PDFs first
// Check file size limits (default: 10MB)
// Check file format (PDF 1.4+)
```

---

## Deployment Issues

### 1. Docker Container Fails
**Error:** Container exits immediately

**Solutions:**
```bash
# Check logs
docker logs container_name

# Run interactively to see errors
docker run -it ai-learning-backend bash

# Check Dockerfile
# Verify ports are exposed
# Verify ENTRYPOINT/CMD

# Test build
docker build -t ai-learning-backend .

# Run with debugging
docker run -it -p 8080:8080 ai-learning-backend
```

**Docker Compose issues:**
```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Rebuild images
docker-compose build --no-cache

# Reset everything
docker-compose down -v
docker-compose up
```

---

### 2. Cloud Deployment Fails
**Error:** App won't deploy to AWS/Azure/Heroku

**AWS Elastic Beanstalk:**
```bash
# Check logs
eb logs

# SSH into instance
eb ssh

# Check environment variables
eb setenv DB_PASSWORD=xxx

# Deploy
eb deploy
```

**Azure App Service:**
```bash
# Check logs
az webapp log tail --name myapp --resource-group mygroup

# Check deployment
az webapp deployment list --name myapp --resource-group mygroup
```

**Heroku:**
```bash
# View logs
heroku logs --tail

# Set environment variables
heroku config:set DB_PASSWORD=xxx

# Deploy
git push heroku main
```

---

### 3. Database Connection in Production
**Error:** "Cannot reach database"

**Solutions:**
```yaml
# Check connection string
spring:
  datasource:
    url: jdbc:postgresql://<hostname>:5432/ailearning
    username: ${DB_USER}
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 10
      minimum-idle: 5
```

**Network troubleshooting:**
```bash
# Test from server
telnet db.example.com 5432

# Check security groups (AWS)
# Check firewall rules

# Verify credentials
psql -h db.example.com -U dbuser -d ailearning

# Check connection pool
# Monitor with tools like pgBouncer
```

---

## Network Issues

### 1. API Timeout
**Error:** "Request timeout" / "504 Gateway Timeout"

**Solutions:**
```java
// Increase timeout in backend
spring:
  mvc:
    async:
      request-timeout: 30000
  jpa:
    properties:
      hibernate:
        jdbc:
          batch_size: 20
          fetch_size: 50
```

```javascript
// Increase timeout in frontend
axios.defaults.timeout = 30000;

// Or per request
axios.get('/api/long-operation', { timeout: 60000 });
```

---

### 2. Intermittent Connection Failures
**Problem:** Sometimes works, sometimes doesn't

**Solutions:**
```javascript
// Add retry logic
const retryRequest = async (fn, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
    }
  }
};

// Usage
await retryRequest(() => api.getQuiz());
```

```java
// Backend resilience
@Retry(maxAttempts = 3, delay = 1000)
@CircuitBreaker(failureThreshold = 5, delay = 10000)
public Quiz getQuiz(Long id) {
    return quizRepository.findById(id).orElse(null);
}
```

---

## Security Issues

### 1. Exposed Secrets
**Problem:** Passwords/API keys in code

**Fix:**
```bash
# Use environment variables
export JWT_SECRET="your-secret"
export DB_PASSWORD="your-password"
export API_KEY="your-api-key"

# Or .env file (NEVER commit)
JWT_SECRET=xxx
DB_PASSWORD=xxx
API_KEY=xxx

# Access in code
String secret = System.getenv("JWT_SECRET");
```

---

### 2. SQL Injection Vulnerability
**Problem:** Unsafe SQL queries

**Fix:**
```java
// ✗ WRONG - Vulnerable to injection
String query = "SELECT * FROM users WHERE email = '" + email + "'";

// ✓ RIGHT - Use parameterized queries
String query = "SELECT * FROM users WHERE email = ?";
PreparedStatement stmt = connection.prepareStatement(query);
stmt.setString(1, email);

// ✓ BEST - Use JPA/Hibernate
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
```

---

### 3. XSS Vulnerability
**Problem:** User input not validated

**Fix:**
```javascript
// ✗ WRONG - Vulnerable to XSS
<div>{userInput}</div>

// ✓ RIGHT - React escapes by default
<div>{sanitizedInput}</div>

// Use sanitization library for HTML
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userHTML);
<div dangerouslySetInnerHTML={{__html: clean}} />
```

---

## Performance Troubleshooting

### 1. Slow API Response
**Problem:** Requests take > 2 seconds

**Debug:**
```bash
# Check slow queries
# Enable query logging in application.yml
logging:
  level:
    org.springframework.web: DEBUG
    org.hibernate.SQL: DEBUG
    org.hibernate.type.descriptor.sql: TRACE

# Check database indexes
SELECT * FROM pg_stat_statements 
WHERE mean_exec_time > 1000 
ORDER BY mean_exec_time DESC;

# Add index
CREATE INDEX idx_user_email ON users(email);
```

---

### 2. High Memory Usage
**Problem:** App uses too much RAM

**Solutions:**
- [ ] Check for memory leaks
- [ ] Reduce cache size
- [ ] Implement pagination (don't load all records)
- [ ] Use lazy loading for relationships
- [ ] Monitor with JProfiler

---

### 3. Slow Frontend
**Problem:** UI is laggy

**Solutions:**
```javascript
// Check bundle size
npm run build -- --stats

// Use React DevTools Profiler
// Memoize expensive components
const MemoQuiz = memo(Quiz);

// Lazy load components
const Quiz = lazy(() => import('./Quiz'));

// Optimize images
<img src={image} loading="lazy" alt="..." />

// Use virtualizing for long lists
<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
>
  {Row}
</FixedSizeList>
```

---

## Getting Help

### Debug Checklist
- [ ] Check browser console (F12)
- [ ] Check backend logs
- [ ] Verify both servers running
- [ ] Clear cache/cookies
- [ ] Test with curl/Postman
- [ ] Check Network tab in DevTools
- [ ] Review recent code changes

### Ask for Help
- Search existing issues/Stack Overflow
- Gather error logs and screenshots
- Note exact steps to reproduce
- Mention OS, browsers, versions
- Create minimal reproducible example

### Useful Links
- [Error Messages](./docs/ERROR_MESSAGES.md)
- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)

---

*Last Updated: February 2024*
*Keep this guide handy! 🛠️*
