@echo off
REM C:\LIVEKIT_PROJECT\CLIENT_SIDE\build_tools\build.bat

echo ========================================
echo LIVEKIT Professional Build Script
echo ========================================
echo.

REM Set variables
set PROJECT_DIR=C:\LIVEKIT_PROJECT
set CLIENT_DIR=%PROJECT_DIR%\CLIENT_SIDE\development
set BUILD_DIR=%PROJECT_DIR%\CLIENT_SIDE\build_tools
set OUTPUT_DIR=%PROJECT_DIR%\OUTPUT

REM Create output directory
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

REM Step 1: Install dependencies
echo [1/6] Installing dependencies...
cd "%CLIENT_DIR%"
call npm install

REM Step 2: Obfuscate code
echo [2/6] Obfuscating JavaScript code...
cd "%CLIENT_DIR%"
call npm run obfuscate

REM Step 3: Build Electron app
echo [3/6] Building Electron application...
call npm run build

REM Step 4: Create packages
echo [4/6] Creating package variants...
call npm run pack-basic
call npm run pack-pro
call npm run pack-business

REM Step 5: Build installer
echo [5/6] Building NSIS installer...
cd "%BUILD_DIR%"
makensis installer.nsi

REM Step 6: Sign executable (optional)
echo [6/6] Signing executable...
REM signtool sign /f "certificate.pfx" /p "password" /t http://timestamp.digicert.com "%OUTPUT_DIR%\LIVEKIT-Setup.exe"

REM Move installer to output
move "LIVEKIT-Setup.exe" "%OUTPUT_DIR%\"

echo.
echo ========================================
echo Build completed successfully!
echo Output: %OUTPUT_DIR%\LIVEKIT-Setup.exe
echo ========================================
pause