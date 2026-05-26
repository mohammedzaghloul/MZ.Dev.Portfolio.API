Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   MZ Portfolio Auto-Deploy Script 🚀" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$workspace = "H:\[All-Project]\API\Portfolio"
$projectPath = "$workspace\Link.Dev.Portfolio.Api\Link.Dev.Portfolio.Api.csproj"
$publishDir = "$workspace\publish"
$ftpServer = "ftp://site69577.siteasp.net/wwwroot"
$username = "site69577"
$password = "qK=89yE@N_x7"

# 1. Compile & Publish the C# ASP.NET Core Project
Write-Host "`n[1/3] Compiling & Publishing C# API in Release mode..." -ForegroundColor Yellow
if (Test-Path -LiteralPath $publishDir) {
    Remove-Item -LiteralPath $publishDir -Recurse -Force -ErrorAction SilentlyContinue
}
dotnet publish $projectPath -c Release -o $publishDir

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Error: Compilation failed. Please make sure Visual Studio / .NET SDK is installed." -ForegroundColor Red
    Pause
    Exit
}
Write-Host "✅ C# API published successfully to $publishDir" -ForegroundColor Green

# 2. Upload compiled files to MonsterASP.net via FTP
Write-Host "`n[2/3] Uploading compiled files to MonsterASP.net via FTP..." -ForegroundColor Yellow

function Upload-FTPFile {
    param(
        [string]$filePath,
        [string]$ftpUrl
    )
    $uri = [System.Uri]$ftpUrl
    $webClient = New-Object System.Net.WebClient
    $webClient.Credentials = New-Object System.Net.NetworkCredential($username, $password)
    try {
        $webClient.UploadFile($uri, "STOR", $filePath)
        Write-Host "Successfully uploaded: ${filePath}" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Failed to upload ${filePath} - $_" -ForegroundColor Red
    }
}

function Create-FTPDirectory {
    param([string]$ftpUrl)
    try {
        $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $response = $request.GetResponse()
        $response.Close()
        Write-Host "Created directory: ${ftpUrl}" -ForegroundColor Cyan
    } catch {
        # Directory might already exist
    }
}

function Remove-FTPFile {
    param([string]$ftpUrl)
    try {
        $request = [System.Net.FtpWebRequest]::Create($ftpUrl)
        $request.Credentials = New-Object System.Net.NetworkCredential($username, $password)
        $request.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
        $response = $request.GetResponse()
        $response.Close()
        Write-Host "Site is now online! app_offline.htm removed." -ForegroundColor Green
    } catch {
        # File might not exist
    }
}

# 2.1 Prevent DLL locking by creating and uploading app_offline.htm
Write-Host "`n[2.1] Stopping application pool temporarily to unlock DLL files..." -ForegroundColor Yellow
$appOfflinePath = "$publishDir\app_offline.htm"
"<!DOCTYPE html><html><head><meta charset='utf-8'><title>Site Under Update</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#1a1a1a;color:#fff;}h1{color:#ff9800;}</style></head><body><h1>⚙️ Portfolio API is updating...</h1><p>We are deploying the latest secure updates. The service will be back online in a few seconds.</p></body></html>" | Out-File -LiteralPath $appOfflinePath -Encoding utf8
Upload-FTPFile -filePath $appOfflinePath -ftpUrl "$ftpServer/app_offline.htm"
Write-Host "Waiting for IIS application pool to shut down and release DLL locks..." -ForegroundColor Gray
Start-Sleep -Seconds 3

# Recursively traverse and upload publish output with LiteralPath
$files = Get-ChildItem -LiteralPath $publishDir -Recurse
foreach ($file in $files) {
    $relative = $file.FullName.Substring($publishDir.Length).Replace("\", "/")
    if ($relative.StartsWith("/")) { $relative = $relative.Substring(1) }
    if ($relative -ne "") {
        # Skip local temp app_offline.htm as we handle it separately
        if ($relative -eq "app_offline.htm") { continue }
        
        $ftpUrl = "$ftpServer/$relative"
        if ($file.PSIsContainer) {
            Create-FTPDirectory -ftpUrl $ftpUrl
        } else {
            Upload-FTPFile -filePath $file.FullName -ftpUrl $ftpUrl
        }
    }
}

# 2.2 Start the website back up by removing app_offline.htm
Write-Host "`n[2.2] Starting application pool back up..." -ForegroundColor Yellow
Remove-FTPFile -ftpUrl "$ftpServer/app_offline.htm"
if (Test-Path -LiteralPath $appOfflinePath) {
    Remove-Item -LiteralPath $appOfflinePath -Force -ErrorAction SilentlyContinue
}

Write-Host "`n✅ C# API uploaded successfully to MonsterASP.net!" -ForegroundColor Green

# 3. Create Frontend Zip for InfinityFree
Write-Host "`n[3/3] Zipping Frontend files for InfinityFree..." -ForegroundColor Yellow
$frontendDir = "$workspace\Frontend\dist\Frontend\browser"
$zipPath = "$workspace\frontend_deploy.zip"
$tempFrontendDir = "$env:TEMP\frontend_src"
$tempZip = "$env:TEMP\frontend_deploy.zip"

# Clean up any old folders/files from previous runs
if (Test-Path -LiteralPath $zipPath) { 
    Remove-Item -LiteralPath $zipPath -Force 
}
if (Test-Path -LiteralPath $tempFrontendDir) { 
    Remove-Item -LiteralPath $tempFrontendDir -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path -LiteralPath $tempZip) { 
    Remove-Item -LiteralPath $tempZip -Force 
}

# Create a clean temp source folder
$null = New-Item -ItemType Directory -Path $tempFrontendDir -Force

# Copy files using LiteralPath which opens files in shared-read mode, completely bypassing locks!
Get-ChildItem -LiteralPath $frontendDir | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $tempFrontendDir -Recurse -Force
}

# Compress to the temp folder (which is unlocked and has no bracket path issues)
$tempFiles = Get-ChildItem -LiteralPath $tempFrontendDir | ForEach-Object { $_.FullName }
Compress-Archive -LiteralPath $tempFiles -DestinationPath $tempZip -Force

# Safely copy the finished zip back to the bracketed workspace path using Copy-Item -LiteralPath
Copy-Item -LiteralPath $tempZip -Destination $zipPath -Force

# Clean up temp files
Remove-Item -LiteralPath $tempFrontendDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $tempZip -Force -ErrorAction SilentlyContinue

Write-Host "✅ Frontend files zipped successfully to: $zipPath" -ForegroundColor Green
Write-Host "`n=============================================" -ForegroundColor Green
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "1. API is Live: http://mohammedzaghloul01.runasp.net" -ForegroundColor Cyan
Write-Host "2. Upload 'frontend_deploy.zip' to InfinityFree htdocs!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Green
Pause
