@echo off
REM C:\LIVEKIT_PROJECT\CLIENT_SIDE\build_tools\deploy.bat

echo ========================================
echo LIVEKIT Server Deployment Script
echo ========================================
echo.

set SERVER_IP=YOUR_VPS_IP
set SERVER_USER=administrator
set SERVER_PATH=/c/LIVEKIT_SERVER
set LOCAL_PATH=C:\LIVEKIT_PROJECT\SERVER_SIDE

echo Deploying to %SERVER_IP%...

REM Upload server files via SCP
scp -r "%LOCAL_PATH%\license-server" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/
scp -r "%LOCAL_PATH%\admin-dashboard" %SERVER_USER%@%SERVER_IP%:%SERVER_PATH%/

REM SSH and install dependencies
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH%/license-server && npm install"

REM Start server with PM2
ssh %SERVER_USER%@%SERVER_IP% "cd %SERVER_PATH%/license-server && pm2 start server.js --name livekit-server"

REM Setup nginx (optional)
ssh %SERVER_USER%@%SERVER_IP% "sudo nginx -s reload"

echo.
echo Deployment completed!
pause