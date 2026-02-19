@echo off
SetLocal EnableDelayedExpansion

REM Color codes (not supported in batch, using text instead)
echo ========================================
echo   AI Learning Platform - Quick Start
echo ========================================
echo.

REM Check prerequisites
echo Checking prerequisites...

REM Check Java
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo X Java is not installed. Please install Java 17+
    pause
    exit /b 1
)
for /f tokens^=2 %%j in ('java -version 2^>^&1 ^| findstr /C:"version"') do set JAVA_VER=%%j
echo [OK] Java %JAVA_VER%

REM Check Node.js
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)
for /f %%j in ('node -v') do set NODE_VER=%%j
echo [OK] Node.js %NODE_VER%

REM Check Maven
mvn -v >nul 2>&1
if %errorlevel% neq 0 (
    echo X Maven is not installed. Please install Maven 3.8+
    pause
    exit /b 1
)
echo [OK] Maven installed
echo.

REM Build backend
echo Building backend...
cd ai-learning-backend
call mvn clean package -DskipTests >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend built successfully
) else (
    echo X Backend build failed
    pause
    exit /b 1
)

REM Start backend in background
echo Starting backend server...
start /B javaw -jar target\ai-learning-backend-1.0.0.jar > backend.log 2>&1
echo [OK] Backend started

REM Wait for backend
timeout /t 5 /nobreak

REM Check backend health
curl -s http://localhost:8080/api/test/hello >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is responding
) else (
    echo X Backend is not responding
    pause
    exit /b 1
)
echo.

REM Build and start frontend
cd ..\ai-learning-frontend

echo Installing frontend dependencies...
call npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Dependencies installed
) else (
    echo X Dependency installation failed
    pause
    exit /b 1
)

echo Starting frontend server...
start cmd /k npm start

REM Display startup information
echo.
echo ========================================
echo   Application Started Successfully!
echo ========================================
echo.
echo Access your application:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8080/api
echo   Chat API:  http://localhost:8080/api/chat
echo.
echo Default Login:
echo   Email:    student@ailearning.com
echo   Password: password123
echo.
echo Logs:
echo   Backend:  .\backend.log
echo   Frontend: Check the npm terminal window
echo.
pause
