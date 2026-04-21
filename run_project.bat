@echo off
TITLE Farm Connect - Developer Mode
color 0A

echo ========================================================
echo         Welcome to the Farm Connect Setup Script!       
echo ========================================================
echo.
echo Please wait while we set up the environment...
echo.

echo [1/4] Installing necessary dependencies...
call npm install

echo.
echo [2/4] Initializing the Database...
call npx prisma db push

echo.
echo [3/4] Seeding Dummy Data (Farmers & Products)...
node seed.js

echo.
echo [4/4] Starting the Development Server!
echo The website will automatically open in your default browser.
echo.

:: Wait 3 seconds to let the server boot, then open the browser
start "" http://localhost:3000

call npm run dev
