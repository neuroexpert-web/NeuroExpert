@echo off
cd /d "c:\Users\USER\Desktop\УЛУЧШЕННЫЙ КОД НЕЙРОЭКСПЕРТ"
echo 🚀 Starting NeuroExpert v3.0 deployment with SSR fixes...
echo.

echo 🔍 Checking git status...
git status
echo.

echo 📁 Adding all files...
git add .
echo.

echo 💾 Committing SSR fixes...
git commit -m "� Fix SSR: Remove static export, add standalone output, fix window errors"
echo.

echo 📤 Pushing to GitHub...
git push origin main
echo.

echo 🌐 Checking remote repositories...
git remote -v
echo.

echo ✅ Deploy script completed with SSR fixes!
echo.
echo 📋 Next steps:
echo 1. Check Netlify dashboard for auto-deploy
echo 2. Build should now succeed without 'window is not defined' errors  
echo 3. Verify GEMINI_API_KEY is set in Netlify environment variables
echo.
pause
