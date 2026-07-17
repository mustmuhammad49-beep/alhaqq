@echo off
echo Cleaning git locks...
if exist .git\index.lock del /f .git\index.lock
if exist .git\HEAD.lock del /f .git\HEAD.lock

echo Pushing to GitHub...
git push origin main

echo Deploying to Netlify...
netlify deploy --prod --dir=.

echo Done.
pause
