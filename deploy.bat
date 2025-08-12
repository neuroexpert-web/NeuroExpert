@echo off
cd /d "c:\Users\USER\Desktop\УЛУЧШЕННЫЙ КОД НЕЙРОЭКСПЕРТ"
echo Checking git status...
git status
echo.
echo Adding all files...
git add .
echo.
echo Committing changes...
git commit -m "🚀 Deploy: Complete NeuroExpert v3.0 with enterprise monitoring"
echo.
echo Pushing to GitHub...
git push origin main
echo.
echo Checking remote repositories...
git remote -v
echo.
echo Deploy script completed.
pause
