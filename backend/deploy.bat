@echo off
title MZ Portfolio Auto-Deployer
echo ====================================================
echo    MZ Portfolio Auto-Deployer Starter 🚀
echo ====================================================
echo.
echo Running PowerShell script...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-Content -LiteralPath '%~dp0deploy.ps1' | Out-String | Invoke-Expression"
echo.
echo ====================================================
echo    Deployment wrapper finished execution.
echo ====================================================
pause
