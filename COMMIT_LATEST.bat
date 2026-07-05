@echo off
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
git add index.html sw.js
git commit -m "Add Latest Entry button: NEW badge on newest card, goToLatest() scrolls + flashes, filter-row button"
git push
echo.
echo Done.
pause
del /f "%~f0"
