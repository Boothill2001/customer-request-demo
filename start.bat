@echo off
cd /d "%~dp0"
node -e "if(Number(process.versions.node.split('.')[0])<24)process.exit(1)"
if errorlevel 1 (
 echo Please install Node.js 24 or newer.
 pause
 exit /b 1
)
if not exist node_modules (
 call npm.cmd ci
 if errorlevel 1 exit /b 1
)
echo Open http://127.0.0.1:3000 in your browser.
call npm.cmd run dev
pause
