@echo off
cd /d "%~dp0backend"
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call "venv\Scripts\activate.bat"
) else (
    echo No virtual environment found, using global Python...
)
echo Starting backend server...
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
pause