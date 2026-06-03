@echo off
echo Starting Event Management Backend Server...
cd backend
call venv\Scripts\activate.bat
uvicorn app.main:app --reload
pause
