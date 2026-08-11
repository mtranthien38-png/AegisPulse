Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$script = Join-Path $root "tools\bienban_nt_tool.py"
$dist = Join-Path $root "dist"
$build = Join-Path $root "build"

if (Test-Path $dist) { Remove-Item $dist -Recurse -Force }
if (Test-Path $build) { Remove-Item $build -Recurse -Force }

python -m PyInstaller `
  --noconfirm `
  --clean `
  --onefile `
  --windowed `
  --name "BienBanNghiemThuTool" `
  --distpath $dist `
  --workpath $build `
  --specpath $build `
  --hidden-import win32com.client `
  --hidden-import pythoncom `
  --hidden-import pywintypes `
  $script

Write-Host "EXE built at: $dist\BienBanNghiemThuTool.exe"
