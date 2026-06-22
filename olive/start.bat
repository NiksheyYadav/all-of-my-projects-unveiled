@echo off
REM AI Device Control Agent - Startup Script

echo ================================================
echo   AI Device Control Agent - Starting System
echo ================================================
echo.

echo [1/2] Starting Safety Supervisor...
start "AI Agent Supervisor" cmd /k python src\supervisor\supervisor.py

echo Waiting for supervisor to initialize...
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Starting AI Agent...
echo.
python main.py

echo.
echo Agent shutdown complete.
pause
