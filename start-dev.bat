@echo off
title WeatherGPT - Conversational Meteorology Platform
echo ======================================================================
echo    🌦️  WeatherGPT – Conversational AI Platform (MoES / IMD)
echo ======================================================================
echo.
echo Starting Backend API Server (Port 5000)...
start "WeatherGPT Backend" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo Starting Frontend Web Portal (Vite)...
start "WeatherGPT Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ======================================================================
echo ✅ Services Launched Successfully!
echo 🌐 Frontend : http://localhost:5173
echo 📡 Backend  : http://localhost:5000/api/health
echo ======================================================================
