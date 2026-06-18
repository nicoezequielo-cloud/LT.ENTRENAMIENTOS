$env:Path = "C:\Program Files\nodejs;C:\Program Files\Cloudflare\Cloudflare WARP;$env:Path"
Set-Location -LiteralPath "C:\Users\norono\Desktop\lt-entrenamientos"

# Start Node.js server
$server = Start-Process -NoNewWindow -FilePath "node.exe" -ArgumentList "server.js" -PassThru
Write-Host "Server PID: $($server.Id)"
Start-Sleep -Seconds 3

# Test server
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3
    Write-Host "Server running on http://localhost:3000"
} catch {
    Write-Host "Server check failed: $_"
    exit 1
}

# Start Cloudflare Tunnel
Write-Host "Starting Cloudflare Tunnel..."
$tunnel = Start-Process -NoNewWindow -FilePath "cloudflared.exe" -ArgumentList "tunnel --url http://localhost:3000" -PassThru
Start-Sleep -Seconds 5

Write-Host "Tunnel PID: $($tunnel.Id)"
Write-Host "Waiting for tunnel URL..."

# Try to find the tunnel URL from process output
Start-Sleep -Seconds 3
Write-Host "Server and tunnel are running"
Write-Host "Check http://localhost:3000 in your browser"
Write-Host "The tunnel URL should appear above"
