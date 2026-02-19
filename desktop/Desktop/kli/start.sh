
#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  AI Learning Platform - Quick Start${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java is not installed. Please install Java 17+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Java $(java -version 2>&1 | grep version)${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed. Please install Node.js 16+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# Check Maven
if ! command -v mvn &> /dev/null; then
    echo -e "${RED}✗ Maven is not installed. Please install Maven 3.8+${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Maven $(mvn -v | head -1)${NC}\n"

# Build backend
echo -e "${YELLOW}Building backend...${NC}"
cd ai-learning-backend
mvn clean package -DskipTests > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend built successfully${NC}"
else
    echo -e "${RED}✗ Backend build failed${NC}"
    exit 1
fi

# Start backend in background
echo -e "${YELLOW}Starting backend server...${NC}"
java -jar target/ai-learning-backend-1.0.0.jar > backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"

# Wait for backend to start
sleep 10

# Check backend health
if curl -s http://localhost:8080/api/test/hello > /dev/null; then
    echo -e "${GREEN}✓ Backend is responding${NC}\n"
else
    echo -e "${RED}✗ Backend is not responding${NC}"
    kill $BACKEND_PID
    exit 1
fi

# Build and start frontend
cd ../ai-learning-frontend

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${RED}✗ Dependency installation failed${NC}"
    kill $BACKEND_PID
    exit 1
fi

echo -e "${YELLOW}Starting frontend server...${NC}"
npm start > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}\n"

# Display startup information
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ Application Started Successfully!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "${YELLOW}Access your application:${NC}"
echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:8080/api${NC}"
echo -e "  Chat API:  ${GREEN}http://localhost:8080/api/chat${NC}\n"

echo -e "${YELLOW}Default Login:${NC}"
echo -e "  Email:    ${GREEN}student@ailearning.com${NC}"
echo -e "  Password: ${GREEN}password123${NC}\n"

echo -e "${YELLOW}Logs:${NC}"
echo -e "  Backend:  ${GREEN}./backend.log${NC}"
echo -e "  Frontend: ${GREEN}./frontend.log${NC}\n"

echo -e "${YELLOW}To stop:${NC}"
echo -e "  kill $BACKEND_PID  # Stop backend"
echo -e "  kill $FRONTEND_PID # Stop frontend\n"

# Keep the script running
wait $BACKEND_PID $FRONTEND_PID
