# ======================================================================
# WeatherGPT - Conversational AI for Weather & Climate (MoES / IMD)
# Multi-Process Launcher Script
# ======================================================================

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "🌦️  WeatherGPT – Conversational Meteorology Platform" -ForegroundColor White
Write-Host "   Ministry of Earth Sciences (MoES) / India Meteorological Department" -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Cyan

# Start Backend Server
Write-Host "`n🚀 Launching Backend API Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"

Start-Sleep -Seconds 2

# Start Frontend Dev Server
Write-Host "🎨 Launching Frontend React App (Vite)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`n======================================================================" -ForegroundColor Green
Write-Host "✅ All WeatherGPT Services Started Successfully!" -ForegroundColor Green
Write-Host "🌐 Frontend Application : http://localhost:5173" -ForegroundColor White
Write-Host "📡 Backend API Health   : http://localhost:5000/api/health" -ForegroundColor White
Write-Host "======================================================================`n" -ForegroundColor Green
