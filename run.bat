@echo off
echo ===================================================
echo     Starting Coding Interview Tutor Application
echo ===================================================

echo [1/3] Starting Python Backend Server (Flask)...
start "Backend Server" cmd /k ".\.venv\Scripts\activate.bat && python app.py"

echo [2/3] Starting Next.js Frontend Server...
start "Frontend Server" cmd /k "cd coding-interview-chat && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening browser to http://localhost:3000...
start http://localhost:3000

echo ===================================================
echo     Application is running in separate windows!
echo     Close those windows when you want to stop.
echo ===================================================
