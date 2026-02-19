# Deployment Guide for AI Learning Platform

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended for Startups)

#### Prerequisites
- Docker installed on your system
- Docker Compose installed

#### Step 1: Prepare Environment
```bash
cd ai-learning-platform

# Create .env file with production settings
cat > .env << EOF
# Database
POSTGRES_USER=ailearning
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=ailearning_db

# Backend
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/ailearning_db
SERVER_PORT=8080
JWT_SECRET=your_jwt_secret_key_here

# Frontend
REACT_APP_API_BASE_URL=http://your-domain.com/api
EOF
```

#### Step 2: Build and Deploy
```bash
# Build docker images
docker-compose build

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

#### Step 3: Verify Deployment
```bash
# Check services are running
docker-compose ps

# Test backend health
curl http://localhost:8080/api/test/hello

# Test frontend
curl http://localhost:3000
```

---

### Option 2: AWS Deployment

#### Using Elastic Beanstalk

```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# Initialize Elastic Beanstalk
cd ai-learning-backend
eb init -p java-17 ai-learning-backend

# Create environment and deploy
eb create ai-learning-prod
eb deploy

# Set environment variables
eb setenv SPRING_DATASOURCE_URL=jdbc:postgresql://your-rds-endpoint:5432/ailearning_db
eb setenv SPRING_DATASOURCE_USERNAME=admin
eb setenv SPRING_DATASOURCE_PASSWORD=your_password
```

#### Database Setup (RDS)
```bash
# Create PostgreSQL RDS instance
aws rds create-db-instance \
  --db-instance-identifier ai-learning-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your_secure_password \
  --allocated-storage 100 \
  --vpc-security-group-ids sg-xxxxxxxx
```

#### Frontend Deployment (CloudFront + S3)
```bash
# Build frontend
cd ai-learning-frontend
npm run build

# Create S3 bucket
aws s3 mb s3://ai-learning-prod-frontend

# Upload build files
aws s3 sync build/ s3://ai-learning-prod-frontend/

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name ai-learning-prod-frontend.s3.amazonaws.com
```

---

### Option 3: Azure Deployment

#### Using App Service

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name ai-learning-rg \
  --location eastus

# Create App Service Plan
az appservice plan create \
  --name ai-learning-plan \
  --resource-group ai-learning-rg \
  --sku B1 \
  --is-linux

# Deploy backend
az webapp create \
  --resource-group ai-learning-rg \
  --plan ai-learning-plan \
  --name ai-learning-backend \
  --runtime java|17-java17

# Deploy frontend
az webapp create \
  --resource-group ai-learning-rg \
  --plan ai-learning-plan \
  --name ai-learning-frontend \
  --runtime node|18-lts
```

#### Database Setup (Azure Database for PostgreSQL)
```bash
az postgres server create \
  --resource-group ai-learning-rg \
  --name ai-learning-db \
  --location eastus \
  --admin-user admin \
  --admin-password your_secure_password \
  --sku-name B_Gen5_1
```

---

### Option 4: Heroku Deployment

#### Backend Deployment
```bash
# Login to Heroku
heroku login

# Create app
heroku create ai-learning-backend

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Add environment variables
heroku config:set JWT_SECRET=your_secret_key
heroku config:set SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

#### Frontend Deployment (Netlify)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
cd ai-learning-frontend
npm run build

# Deploy
netlify deploy --prod --dir build
```

---

### Option 5: DigitalOcean Deployment

#### VPS Setup
```bash
# SSH into your droplet
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Java 17
apt install openjdk-17-jdk -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install nodejs -y

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Create database
sudo -u postgres createdb ailearning_db
```

#### Deploy Application
```bash
# Clone repository
git clone your-repo-url
cd ai-learning-platform

# Build backend
cd ai-learning-backend
mvn clean package -DskipTests

# Start backend
nohup java -jar target/ai-learning-backend-1.0.0.jar > backend.log 2>&1 &

# Build and start frontend
cd ../ai-learning-frontend
npm install
npm run build
npx serve -s build -l 3000 &

# Setup Nginx as reverse proxy
apt install nginx -y
# Edit /etc/nginx/sites-available/default
# Point to localhost:3000 and localhost:8080
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# Never commit sensitive data
# Use environment variables instead
echo ".env" >> .gitignore
echo "*.key" >> .gitignore
echo "*.pem" >> .gitignore
```

### 2. SSL/TLS Certificate
```bash
# Using Let's Encrypt (free)
certbot certonly --standalone -d your-domain.com
# Auto-renew
certbot renew --dry-run
```

### 3. Database Security
```sql
-- Restrict user permissions
CREATE USER ailearning WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE ailearning_db TO ailearning;
GRANT USAGE ON SCHEMA public TO ailearning;
GRANT CREATE ON SCHEMA public TO ailearning;
```

### 4. API Rate Limiting
```yaml
# Add to backend application.yml
spring:
  cloud:
    sleuth:
      enabled: false
    gateway:
      routes:
        - id: api
          uri: lb://backend
          predicates:
            - Path=/api/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter:
                  replenishRate: 100
                  burstCapacity: 200
```

---

## 📊 Monitoring & Logging

### Using ELK Stack
```bash
# Deploy Elasticsearch
docker run -d --name elasticsearch -p 9200:9200 docker.elastic.co/elasticsearch/elasticsearch:8.0.0

# Deploy Logstash
docker run -d --name logstash -p 5000:5000 docker.elastic.co/logstash/logstash:8.0.0

# Deploy Kibana
docker run -d --name kibana -p 5601:5601 docker.elastic.co/kibana/kibana:8.0.0
```

### Application Logging
```properties
# application.properties
logging.level.root=INFO
logging.level.com.ailearning=DEBUG
logging.file.name=logs/application.log
logging.file.max-size=10MB
logging.file.max-history=10
```

---

## 🔄 Continuous Integration/Deployment (CI/CD)

### GitHub Actions Workflow
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Backend
        run: |
          cd ai-learning-backend
          mvn clean package -DskipTests
      
      - name: Build Frontend
        run: |
          cd ai-learning-frontend
          npm install
          npm run build
      
      - name: Deploy to AWS
        run: |
          # Deploy commands here
          aws s3 sync ai-learning-frontend/build s3://bucket-name/
          aws elasticbeanstalk create-application-version ...
```

---

## 📈 Scaling Strategy

### Phase 1: MVP (0-10k users)
- Single VPS with Docker Compose
- PostgreSQL on same server
- Static assets on server

### Phase 2: Growth (10k-100k users)
- Separate database server (AWS RDS)
- Multiple backend instances (load balanced)
- CDN for static assets
- Redis for caching

### Phase 3: Scale (100k+ users)
- Kubernetes cluster (EKS/AKS)
- Database replication and sharding
- Microservices architecture
- Vertical scaling for search and analytics

---

## 🆘 Troubleshooting

### Backend won't start
```bash
# Check java version
java -version

# Check port 8080 is available
lsof -i :8080

# Check database connection
mysql -h localhost -u admin -p

# View detailed logs
tail -f backend.log | grep ERROR
```

### Frontend not connecting to API
```bash
# Check CORS headers
curl -H "Origin: http://localhost:3000" \
     http://localhost:8080/api/test/hello -v

# Check API base URL in .env
cat ai-learning-frontend/.env | grep REACT_APP_API_BASE_URL
```

### Database issues
```sql
-- Check if database exists
\l

-- Recreate database
DROP DATABASE IF EXISTS ailearning_db;
CREATE DATABASE ailearning_db;

-- Check user permissions
\du
```

---

## 📞 Support & Resources

- Documentation: Create a `/docs` folder with detailed guides
- Issues: Use GitHub Issues for bug tracking
- Discussions: GitHub Discussions for feature requests
- Email: support@ailearning.com

---

**Last Updated**: February 2024
**Maintained By**: AI Learning Team
