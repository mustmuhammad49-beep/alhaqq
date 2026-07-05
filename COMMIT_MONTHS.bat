@echo off
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
git add index.html sw.js
git commit -m "Add Foundation entry: The Four Sacred Months, step by step with verses (9:36, 9:37, 2:194, 2:197, 2:217, 5:2, 5:97)"
git push
echo.
echo Done.
pause
del /f "%~f0"
