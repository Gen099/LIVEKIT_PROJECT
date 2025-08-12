@echo off
REM C:\LIVEKIT_PROJECT\CLIENT_SIDE\build_tools\setup_accounts.bat

echo Setting up OBS for all accounts...

set SOURCE_OBS=C:\LIVEKIT_PROJECT\SHARED_RESOURCES\obs-portable
set PACKAGES_DIR=C:\LIVEKIT_PROJECT\CLIENT_SIDE\packages

REM Setup BASIC package (3 accounts)
for /L %%i in (1,1,3) do (
    echo Copying to BASIC Account_%%i...
    xcopy "%SOURCE_OBS%" "%PACKAGES_DIR%\BASIC\accounts\Account_%%i\obs-studio\" /E /I /Y
)

REM Setup PRO package (5 accounts)
for /L %%i in (1,1,5) do (
    echo Copying to PRO Account_%%i...
    xcopy "%SOURCE_OBS%" "%PACKAGES_DIR%\PRO\accounts\Account_%%i\obs-studio\" /E /I /Y
)

REM Setup BUSINESS package (10 accounts)
for /L %%i in (1,1,10) do (
    echo Copying to BUSINESS Account_%%i...
    xcopy "%SOURCE_OBS%" "%PACKAGES_DIR%\BUSINESS\accounts\Account_%%i\obs-studio\" /E /I /Y
)

echo ✅ Setup completed!
pause