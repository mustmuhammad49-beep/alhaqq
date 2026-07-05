@echo off
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
git add index.html sw.js
git status
git commit -m "Add NT-corruption entry: Comma Johanneum, long Mark, John 8 pericope, 1 Tim 3:16, sourced to Metzger/Ehrman/Wallace and their own Bible footnotes"
git push
echo.
echo Done. Check above for any errors.
pause
del /f "%~f0"
