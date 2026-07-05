@echo off
cd /d "%~dp0"
git add index.html sw.js
git commit -m "Fix verseDB: add 16 missing verse entries (2:23, 2:146, 2:255, 4:105, 7:204, 12:1, 16:89, 25:32, 29:45, 29:48, 35:29, 38:29, 43:4, 73:20, 87:6, 96:3) + sw v44"
git push origin main
