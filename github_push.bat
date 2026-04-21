@echo off
echo ==================================================
echo Pushing Farm Connect updates to GitHub...
echo ==================================================

cd /d "%~dp0"

echo [1/4] Checking Git status...
git status

echo.
echo [2/4] Staging all changes...
git add -A

echo.
echo [3/4] Committing changes...
git commit -m "fix: add DNS fix for MongoDB SRV, seed demo data, and update marketplace ratings to deterministic values"

echo.
echo [4/4] Pushing to GitHub (main branch)...
git push origin main || git push origin master

echo.
echo ==================================================
echo ✅ Push complete! Check your GitHub repository.
echo ==================================================
pause
