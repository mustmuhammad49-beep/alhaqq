@echo off
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
git add index.html sw.js
git commit -m "Fix Latest Entry button: move out of nested div, now renders as own filter row"
git push
echo.
echo Done.
pause
del /f "%~f0"
