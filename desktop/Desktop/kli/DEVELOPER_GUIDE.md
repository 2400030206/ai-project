# 👨‍💻 Developer Quick Start Guide

## 🎯 Project Overview

**AI Learning Platform** - A web-based learning assistant that helps students learn using AI-powered features like:
- PDF analysis and quiz generation
- Smart exam creation with diagrams
- ChatGPT-like AI learning assistant
- Progress tracking and analytics

**Tech Stack:**
- Frontend: React 19.2.4
- Backend: Spring Boot 3.2.2
- Database: PostgreSQL (prod) / H2 (dev)
- Build: Maven / npm

---

## ⚙️ Prerequisites

Before you start, ensure you have:

```bash
# Windows
- Java 17+ (java -version)
- Node.js 16+ (npm --version) 
- Maven 3.8+ (mvn --version)
- Git (git --version)
- PostgreSQL 12+ (optional, for production)
```

**Install Missing Tools:**
```bash
# Windows - Using Chocolatey
choco install openjdk17
choco install nodejs
choco install maven
choco install git
choco install postgresql
```

---

## 📁 Project Structure

```
ai-learning-frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/         # React components
│   │   ├── Navbar.js
│   │   ├── Quiz.js
│   │   ├── Exam.js
│   │   ├── ChatBot.js
│   │   ├── VideoPlayer.js
│   │   └── Whiteboard.js
│   ├── pages/              # Page components
│   │   ├── Dashboard.js
│   │   ├── Exam.js
│   │   ├── Review.js
│   │   ├── Chat.js
│   │   └── Login.js
│   ├── services/           # API client
│   │   └── api.js
│   ├── context/            # React context
│   │   └── AppContext.js
│   ├── App.js              # Main app component
│   ├── index.js            # Entry point
│   └── styles/             # Global styles
├── package.json            # npm dependencies
└── README.md               # Project documentation

ai-learning-backend/       # Spring Boot backend
├── src/main/java/
│   └── com/ailearning/
│       ├── controller/     # REST endpoints
│       ├── service/        # Business logic
│       ├── entity/         # JPA entities
│       ├── dto/            # Data transfer objects
│       ├── security/       # JWT security
│       └── config/         # Configuration
├── src/main/resources/
│   ├── application.yml     # App config
│   └── data.sql            # Sample data
├── pom.xml                 # Maven dependencies
└── README.md               # Backend docs
```

---

## 🚀 Getting Started - Local Development

### Step 1: Clone & Navigate
```bash
git clone <repo-url> ai-learning
cd ai-learning
```

### Step 2: Start Backend

```bash
# Navigate to backend
cd ai-learning-backend

# Build with Maven
mvn clean install -DskipTests

# Start development server
mvn spring-boot:run
# or
java -jar target/ai-learning-backend-1.0.0.jar

# Server starts on: http://localhost:8080
# API docs: http://localhost:8080/swagger-ui.html
```

### Step 3: Start Frontend

```bash
# Open new terminal, navigate to frontend
cd ai-learning-frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend opens at: http://localhost:3000
```

### Step 4: Login & Test

```
Email: student@ailearning.com
Password: password123

Admin: admin@ailearning.com
Password: password123
```

---

## 🔧 Development Workflow

### Making Changes

**Frontend Change:**
```bash
cd ai-learning-frontend
# Edit files in src/
# Changes auto-reload with npm start
```

**Backend Change:**
```bash
cd ai-learning-backend
# Edit files in src/
# Restart with mvn spring-boot:run
# Or use Spring Boot DevTools (auto-restart)
```

### Testing

**Frontend Tests:**
```bash
npm test
npm test -- --coverage
```

**Backend Tests:**
```bash
mvn test
mvn test -DTest=UserControllerTest
```

### Building for Production

**Frontend:**
```bash
npm run build
# Creates optimized build in build/
```

**Backend:**
```bash
mvn clean package -DskipTests
# Creates JAR in target/
```

---

## 📝 Code Conventions

### Frontend (React)
```javascript
// Components: PascalCase
export default function MyComponent() {
  return (
    <div className="my-component">
      <h1>Hello</h1>
    </div>
  );
}

// Methods/Variables: camelCase
const handleClick = () => {};
const userName = "John";

// CSS: kebab-case
.my-component {
  color: blue;
}
```

### Backend (Java)
```java
// Classes: PascalCase
public class UserService {
  
  // Methods: camelCase
  public User getUserById(Long id) {
    return userRepository.findById(id);
  }
  
  // Constants: UPPER_SNAKE_CASE
  private static final String API_KEY = "xxx";
}

// DTOs: PascalCase + "DTO"
public class UserLoginDTO {
  private String email;
  private String password;
}
```

---

## 🐛 Debugging

### Frontend Debugging

```javascript
// Chrome DevTools
// 1. Open: F12
// 2. Console: See errors/logs
// 3. Network: Check API calls
// 4. React DevTools: Inspect components

// Add breakpoints
debugger;

// Console logging
console.log('User:', user);
console.error('Error:', error);
```

### Backend Debugging

```bash
# View logs
tail -f logs/application.log

# Enable debug logs (application.yml)
logging:
  level:
    com.ailearning: DEBUG
    org.springframework.web: DEBUG

# Using debugger in IDE
# Set breakpoint, run mvn spring-boot:run with debug
```

---

## 🔄 Database

### Development (H2)
```properties
# application.yml
spring:
  datasource:
    url: jdbc:h2:mem:ailearning
    username: sa
    password: 
  jpa:
    database-platform: org.hibernate.dialect.H2Dialect
    hibernate:
      ddl-auto: create-drop
```

**Access H2 Console:** http://localhost:8080/h2-console

### Production (PostgreSQL)
```properties
# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/ailearning
    username: postgres
    password: ${DB_PASSWORD}
  jpa:
    database-platform: org.hibernate.dialect.PostgresPLPlatform
    hibernate:
      ddl-auto: validate
```

### Database Queries
```sql
-- View all users
SELECT * FROM users;

-- View quiz responses
SELECT * FROM quiz_responses;

-- View exams taken
SELECT * FROM exam_attempts;

-- Check database size
SELECT pg_size_pretty(pg_database_size('ailearning'));
```

---

## 📚 API Development

### Adding New Endpoint

**1. Create DTO (if needed):**
```java
// src/main/java/com/ailearning/dto/CreatePostDTO.java
public class CreatePostDTO {
  private String title;
  private String content;
  // getters/setters
}
```

**2. Create Controller:**
```java
// src/main/java/com/ailearning/controller/PostController.java
@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
  
  @Autowired
  private PostService postService;
  
  @PostMapping("/create")
  public ResponseEntity<PostDTO> createPost(@RequestBody CreatePostDTO dto) {
    PostDTO post = postService.createPost(dto);
    return ResponseEntity.ok(post);
  }
}
```

**3. Create Service:**
```java
// src/main/java/com/ailearning/service/PostService.java
@Service
public class PostService {
  
  @Autowired
  private PostRepository postRepository;
  
  public PostDTO createPost(CreatePostDTO dto) {
    Post post = new Post();
    post.setTitle(dto.getTitle());
    post.setContent(dto.getContent());
    postRepository.save(post);
    return new PostDTO(post);
  }
}
```

**4. Call from Frontend:**
```javascript
// services/api.js
export const createPost = (postData) => {
  return axios.post('/api/posts/create', postData);
};

// In component
const handleCreatePost = async (data) => {
  const response = await createPost(data);
  console.log('Post created:', response.data);
};
```

---

## 🔐 Security Best Practices

### Frontend
```javascript
// 1. Never store sensitive data in localStorage
// localStorage.setItem('password', pwd); // ❌ WRONG

// 2. Use HTTPS in production
// Always use https:// URLs

// 3. Escape user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);

// 4. Validate on frontend AND backend
if (!email.includes('@')) {
  showError('Invalid email');
}
```

### Backend
```java
// 1. Always validate input
@Valid @RequestBody UserDTO dto

// 2. Use parameterized queries
String sql = "SELECT * FROM users WHERE email = ?";
// Not: "SELECT * FROM users WHERE email = '" + email + "'";

// 3. Hash passwords
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hashed = encoder.encode(plainPassword);

// 4. Use JWT for auth
@Configuration
public class SecurityConfig {
  // Configure JWT filters
}

// 5. CORS only for trusted origins
@CrossOrigin(origins = {"https://ailearning.com", "http://localhost:3000"})
```

---

## 📦 Dependencies

### Frontend (Important)
```json
{
  "react": "^19.2.4",
  "react-router-dom": "^6",
  "axios": "^1.6",
  "react-pdf": "^8.x",
  "framer-motion": "^10.x"
}
```

### Backend (Important)
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
  <version>3.2.2</version>
</dependency>
<dependency>
  <groupId>org.apache.pdfbox</groupId>
  <artifactId>pdfbox</artifactId>
  <version>3.0.1</version>
</dependency>
<dependency>
  <groupId>org.apache.opennlp</groupId>
  <artifactId>opennlp-tools</artifactId>
  <version>2.3.2</version>
</dependency>
```

---

## 🚀 Performance Tips

### Frontend
```javascript
// 1. Code splitting
const Quiz = lazy(() => import('./Quiz'));

// 2. Memoization
const MemoizedComponent = memo(MyComponent);

// 3. Image optimization
<img src={image} loading="lazy" alt="..." />

// 4. Debounce expensive operations
const handleSearch = debounce((query) => {
  searchAPI(query);
}, 300);
```

### Backend
```java
// 1. Use pagination
@GetMapping("/users")
public Page<User> getUsers(@PageableDefault(size = 20) Pageable pageable)

// 2. Caching
@Cacheable("users")
public User getUserById(Long id)

// 3. Database indexing
@Column(unique = true, nullable = false)
private String email;

// 4. Lazy loading
@OneToMany(fetch = FetchType.LAZY)
private List<Post> posts;

// 5. Asynchronous operations
@Async
public void sendEmail(String email)
```

---

## 🆘 Common Issues & Solutions

### Issue: npm install fails
```bash
# Solution: Clear cache
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

### Issue: Maven build fails
```bash
# Solution: Clean and rebuild
mvn clean install -DskipTests

# Skip tests if problematic
mvn clean package -DskipTests
```

### Issue: Port already in use
```bash
# Frontend (3000)
PORT=3001 npm start

# Backend (8080)
java -jar target/*.jar --server.port=8081
```

### Issue: CORS errors
```
Check CORS config in SecurityConfig.java
Ensure frontend URL is in @CrossOrigin origins
```

### Issue: Database connection fails
```
Check DB is running (PostgreSQL or H2)
Verify connection string in application.yml
Check username/password
```

---

## 📖 Resources

### Documentation
- [Frontend README](./ai-learning-frontend/README.md)
- [Backend README](./ai-learning-backend/README.md)
- [API Documentation](./docs/API.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Learning
- [React Docs](https://react.dev)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Java Docs](https://docs.oracle.com/en/java/javase/17/)

### Tools
- IDE: VS Code, IntelliJ IDEA
- DevTools: Chrome DevTools, Postman
- Git: GitHub, GitLab, Bitbucket

---

## ✅ Pre-Commit Checklist

Before pushing code:
- [ ] Code runs without errors
- [ ] No console errors/warnings
- [ ] Tests pass locally
- [ ] Code is formatted properly
- [ ] Variables are named clearly
- [ ] Comments added for complex logic
- [ ] No sensitive data in code
- [ ] Dependencies are necessary

---

## 🤝 Contributing

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   npm test
   mvn test
   ```

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add user authentication"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Code review & merge**

---

## 📞 Getting Help

- **Slack**: #dev-support
- **Email**: dev-team@ailearning.com
- **GitHub Issues**: Create issue with details
- **Stack Overflow**: Tag with [spring-boot], [react]

---

*Last Updated: February 2024*
*Happy Coding! 🚀*
