@echo off
cd /d "C:\Users\Admin\OneDrive\Desktop\alhaqq"
del /f ".git\index.lock" 2>nul
del /f ".git\HEAD.lock" 2>nul
git read-tree HEAD
git rm --cached creator.html v2_css.txt v2_js.txt
del /f "creator.html" 2>nul
git status
git commit -m "Cleanup: remove creator.html, v2_css.txt, v2_js.txt from repo"
git push
echo.
echo Done. Press any key.
pause
del /f "%~f0"
del /f "CLEANUP.bat" 2>nul
del /f "FIX.bat" 2>nul
del /f "PUSH.bat" 2>nul
