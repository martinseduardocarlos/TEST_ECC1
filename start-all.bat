@echo off
title Iniciando ECC - Backend + Frontend

REM ------------------------------
REM Inicia o Backend (FastAPI)
REM ------------------------------
start cmd /k "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

REM ------------------------------
REM Inicia o Frontend (React)
REM ------------------------------
start cmd /k "cd frontend && set HOST=0.0.0.0 && npm start"

echo ================================
echo Backend e Frontend iniciados!
echo Acesse no celular pelo IP da máquina:
echo Frontend: http://SEU_IP:3000
echo Backend:  http://SEU_IP:8000
echo ================================
pause
