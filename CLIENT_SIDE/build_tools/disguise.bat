@echo off
REM C:\LIVEKIT_PROJECT\CLIENT_SIDE\build_tools\disguise.bat
REM Công dụng: Đổi tên các file để che giấu công nghệ

echo Disguising technology components...

REM Đổi tên OBS
ren "obs64.exe" "stream-engine.exe"
ren "obs32.exe" "stream-engine-x86.exe"
ren "obs-studio" "streaming-core"

REM Đổi tên SocksCap64
ren "SocksCap64.exe" "network-optimizer.exe"
ren "sockscap64" "net-module"

REM Tạo file giả để đánh lừa
echo. > "Microsoft.StreamingService.dll"
echo. > "Windows.MediaOptimizer.exe"

echo ✅ Disguise completed!