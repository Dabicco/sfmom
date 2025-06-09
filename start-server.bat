@echo off
echo SAFE MOM PWA Server
echo ==================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if index.html exists
if not exist "index.html" (
    echo Error: index.html not found in current directory
    echo Please run this script from the app directory
    pause
    exit /b 1
)

echo Starting server...
echo.
echo The app will be available at:
echo   HTTP:  http://localhost:8000
echo   HTTPS: https://localhost:8000 (if supported)
echo.
echo Note: PWA features work best with HTTPS
echo.
echo Press Ctrl+C to stop the server
echo.

REM Try to start the Python server
python server.py

pause 