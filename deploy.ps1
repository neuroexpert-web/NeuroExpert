# NeuroExpert v3.0 Deploy Script
Write-Host "🚀 Starting NeuroExpert v3.0 deployment..." -ForegroundColor Green

# Change to project directory
Set-Location -Path "c:\Users\USER\Desktop\УЛУЧШЕННЫЙ КОД НЕЙРОЭКСПЕРТ"

Write-Host "📂 Current directory: $(Get-Location)" -ForegroundColor Yellow

# Check git status
Write-Host "🔍 Checking git status..." -ForegroundColor Blue
git status

# Add all files
Write-Host "📁 Adding all files..." -ForegroundColor Blue
git add .

# Commit changes
Write-Host "💾 Committing changes..." -ForegroundColor Blue
git commit -m "🚀 Deploy: Complete NeuroExpert v3.0 with enterprise monitoring systems"

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
git push origin main

# Check remote repositories
Write-Host "🌐 Checking remote repositories..." -ForegroundColor Blue
git remote -v

# Show final status
Write-Host "✅ Deploy script completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your Netlify dashboard" -ForegroundColor White
Write-Host "2. Check if auto-deploy triggered" -ForegroundColor White
Write-Host "3. If not, manually trigger deploy" -ForegroundColor White
Write-Host "4. Verify GEMINI_API_KEY is set in Netlify environment variables" -ForegroundColor White

Read-Host "Press Enter to continue..."
