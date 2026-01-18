@echo off
chcp 65001 >nul
title Fish Farm Consultant - Laravel

echo ============================================
echo   Fish Farm Consultant - Laravel Server
echo ============================================
echo.

REM Add PHP to PATH
set PATH=%PATH%;C:\xampp\php

REM Change to Laravel directory
cd /d "%~dp0"

echo [1/2] Checking database...
php artisan migrate --force 2>nul
if %errorlevel% neq 0 (
    echo Creating database...
    php artisan migrate --force
)

echo.
echo [2/2] Starting Laravel server...
echo.
echo ============================================
echo   Server running at: http://localhost:8000
echo   Press Ctrl+C to stop
echo ============================================
echo.

php artisan serve --host=0.0.0.0 --port=8000

pause
