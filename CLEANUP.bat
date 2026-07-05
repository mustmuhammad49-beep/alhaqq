@echo off
cd /d "C:\Users\Admin\OneDrive\Desktop\alhaqq"
del /f ".git\index.lock" 2>nul
git rm creator.html v2_css.txt v2_js.txt
git commit -m "Cleanup: remove creator.html, v2_css.txt, v2_js.txt from repo"
git push
echo.
echo Done. Press any key to close.
pause
del /f "%~f0"
