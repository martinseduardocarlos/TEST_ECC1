@echo off
title Iniciando ECC com QR Code

REM ------------------------------
REM Descubra o IP automaticamente
REM ------------------------------
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%A
)
set IP=%IP: =%
echo Seu IP da rede local: %IP%

REM ------------------------------
REM Gera QR Code com Python
REM ------------------------------
python - <<END
import qrcode
ip = "%IP%"
url = f"http://{ip}:3000"
img = qrcode.make(url)
img.show()
print("QR Code aberto! Aponte a câmera do celular para acessar o frontend.")
END

REM ------------------------------
REM Inicia Backend e Frontend
REM ------------------------------
start cmd /k "cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --reload"
start cmd /k "cd frontend && set HOST=0.0.0.0 && npm start"

echo ================================
echo Backend e Frontend iniciados!
echo Frontend: http://%IP%:3000 (use QR Code)
echo Backend:  http://%IP%:8000
echo ================================
pause
